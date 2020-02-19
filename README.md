# HUGO Site for https://teachinglab.org

## Setup

```bash
git clone -b master git@github.com/james-minton/teachinglab.git
cd teachinglab
npm install # Requires autoprefixer
npm install -g postcss-cli # Usually works better if this runs globally. See https://gohugo.io/hugo-pipes/postcss/#readout
```

## Development

```
hugo server -w
```

To test the twitter feed function, you need to also run `npm run lambda-serve` in a separate terminal session. This serves the lambda function for the twitter feed script to hit. This script requires special twitter dev credentials. On Netlify, these are provided as environment variables. When working locally, create a `.env` file and add the credentials there.

## Build

```
hugo
```

## Deploy

To deploy, merge your working branch into `master` and `git push`.
