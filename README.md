# gatsby-source-goodreads

[Forked from DanielOliver/gatsby-source-goodreads](https://github.com/DanielOliver/gatsby-source-goodreads)

Source plugin for pulling your read books into Gatsby from Goodreads API. Supports private Goodreads profiles.

```bash
npm i @hueyy/gatsby-source-goodreads
```

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-goodreads",
      options: {
        apiKey: "",
        apiSecret: "",
        oauthToken: "",
        oauthSecret: "",
        userId: "",
        shelf: "to-read" // optional, defaults to currently-reading
      }
    }
  ],
}
```

## Plugin options

Get your `apiKey` and `apiSecret` from [Goodreads](https://www.goodreads.com/api/keys).

Your `userId` is the string of numbers in the URL of your profile page. For instance, if you're Jeffrey Keeten and your Goodreads profile page is [https://www.goodreads.com/user/show/3427339-jeffrey-keeten](https://www.goodreads.com/user/show/3427339-jeffrey-keeten), then your `userId` is `3427339`.

Leave `oauthToken` and `oauthSecret` blank and run `gatsby develop`. An `oauthToken` and `oauthSecret` will be printed to the console, together with an authorisation URL. Open that in your web browser, and allow your Goodreads app access to your account. Then, copy the `oauthToken` and `oauthSecret` into the plugin options, and run `gatsby develop` again.

## How to query your Goodread data using GraphQL

Below is a sample query for fetching the shelf's books.

```graphql
query goodRead {
  goodreadsShelf {
    id
    shelfName
    reviews {
      reviewID
      rating
      votes
      spoilerFlag
      spolersState
      dateAdded
      dateUpdated
      readAt
      startedAt
      body
      book {
        bookID
        isbn
        isbn13
        textReviewsCount
        uri
        link
        title
        titleWithoutSeries
        imageUrl
        smallImageUrl
        largeImageUrl
        description
      }
    }
  }
}
```
