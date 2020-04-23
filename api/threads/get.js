const Promise = require("bluebird");
const getThreadFrom = require("../utils/getThreadFrom");
const { PAGE_LIMIT } = require("../utils/constants");

/**
 * Description: Retrieves a list of threads based on the page and search parameters
 * Endpoint:    GET /api/threads?page=:page&search=:search
 * Response:
 * [
 *   {
 *     id: String,
 *     subject: String,
 *     from: { name: String, email: String },
 *     date: Timestamp,
 *     snippet: String,
 *     hasAttachments: Boolean,
 *     unread: Boolean
 *   }
 * ]
 */
module.exports = async (req, res) => {
  try {
    const page = req.query.page >= 1 ? req.query.page : 1;
    const search = req.query.search || "";

    /**
     * We request one more result than we will return so we can
     * check if there is a next page.
     */
    const pagination = {
      limit: PAGE_LIMIT + 1,
      offset: (page - 1) * PAGE_LIMIT
    };

    let threads = await (search.length > 0
      ? expandThreads({
          nylas: req.nylas,
          threads: await req.nylas.threads.search(
            req.account.organizationUnit === "label"
              ? `in:inbox is:unread ${search}`
              : search,
            { ...pagination }
          )
        })
      : req.nylas.threads.list({
          in: "inbox",
          unread: true,
          view: "expanded",
          ...pagination
        }));

    threads = threads.map(thread => {
      thread.from = getThreadFrom(thread);
      return thread;
    });

    res.status(200).json({
      hasPrevious: page > 1,
      hasNext: threads.length > PAGE_LIMIT,
      threads: threads.map(simplifyThread).slice(0, PAGE_LIMIT)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

/**
 * We need the expanded thread view. Search does not support views
 * so we enrich the results ourselves with the same "messages" key
 */
function expandThreads({ nylas, threads }) {
  return Promise.map(
    threads,
    async thread => {
      const messages = await nylas.messages.list({
        thread_id: thread.id
      });

      thread.messages = messages;

      return thread;
    },
    { concurrency: 5 }
  );
  // limit to 5 calls at a time to stay under the rate limit
}

function simplifyThread(thread) {
  return {
    id: thread.id,
    subject: thread.subject,
    from: thread.from,
    date: thread.lastMessageTimestamp,
    snippet: thread.snippet,
    unread: thread.unread,
    hasAttachments: thread.hasAttachments
  };
}
