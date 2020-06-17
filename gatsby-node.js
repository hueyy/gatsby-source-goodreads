const crypto = require(`crypto`)
const { default: Goodreads } = require(`node-goodreads`)

exports.sourceNodes = async (
  {
    boundActionCreators,
    reporter
  },
  {
    userId,
    shelves = [`currently-reading`],
    apiKey,
    apiSecret,
    oauthToken,
    oauthSecret,
  }) => {
  const { createNode } = boundActionCreators
  const gr = Goodreads({ key: apiKey, secret: apiSecret })

  activity = reporter.activityTimer(`fetching goodreads shelf`)
  activity.start()

  if (!oauthToken || !oauthSecret) {
    const { oauthToken, oauthSecret, url } = await gr.authoriseUser()
    console.log(
      `oauthToken: ${oauthToken}\n`,
      `oauthSecret: ${oauthSecret}\n`,
      `Please navigate to ${url} and allow this application to access your Goodreads account, `
      + `then provide the oauthToken and oauthSecret to the plugin as options`
    )
    reporter.panic(`gatsby-source-goodreads: Missing oauthToken and/or oauthSecret`)
  }

  gr.configureOauth(oauthToken, oauthSecret)

  for (let i = 0; i < shelves.length; i++) {
    const shelf = shelves[i]

    let reviews = []
    try {
      reviews = (await gr.reviewsList(userId, shelf)).reviews.review
    } catch (error) {
      reporter.panic(`gatsby-source-goodreads: Failed API call -  ${JSON.stringify(error)}`)
    }

    reviews = reviews.map(({
      id: [reviewID],
      rating: [rating],
      votes: [votes],
      spoiler_flag: [spoilerFlag],
      spoilers_state: [spoilersState],
      date_added: [dateAdded],
      date_updated: [dateUpdated],
      started_at: [startedAt],
      read_at: [readAt],
      body: [body],
      url: [url],
      book: [{
        id: [{ _: bookID }],
        isbn: [isbn],
        isbn13: [isbn13],
        text_reviews_count: [{ _: textReviewsCount }],
        uri: [uri],
        link: [link],
        title: [title],
        title_without_series: [titleWithoutSeries],
        image_url: [imageUrl],
        small_image_url: [smallImageUrl],
        large_image_url: [largeImageUrl],
        description: [description]
      }],

    }) => ({
      reviewID,
      rating,
      votes,
      spoilerFlag,
      spoilersState,
      dateAdded,
      dateUpdated,
      body,
      readAt,
      startedAt,
      url,
      book: {
        bookID,
        isbn: Number.isNaN(Number.parseInt(isbn)) ? `` : isbn,
        isbn13: Number.isNaN(Number.parseInt(isbn13)) ? `` : isbn13,
        textReviewsCount,
        uri,
        link,
        title,
        titleWithoutSeries,
        imageUrl,
        smallImageUrl,
        largeImageUrl,
        description
      }
    }))

    createNode({
      shelfName: shelf,
      reviews,
      id: `reviewList-${userId}-${shelf}`,
      parent: null,
      children: [],
      internal: {
        type: `GoodreadsShelf`,
        contentDigest: crypto
          .createHash(`md5`)
          .update(`shelf-${userId}-${shelf}`)
          .digest(`hex`)
      }
    })
  }


  activity.end()
  return
}