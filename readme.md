# KeystoneJS Blog Boilerplate

### To start the server will need:
1. mongo installed and running
2. Node version `7.5.0` and npm version `4.1.2` or higher. It might work with other versions but I haven't tested it.
3. A [Cloudinary](https://cloudinary.com) account
4. A `.env` file in the project root with at least `CLOUDINARY_URL` and `COOKIE_SECRET` set.

Then run:
```
npm start
```

Basic site configuration can be done in `/lib/siteConfig.js`

## NPM Scripts
You can config useful development scripts in `package.json`

```
npm run deploy-staging
```
Deploys your staging git branch to Heroku


```
npm run deploy-prod
```
Deploys your master git branch to Heroku


```
npm run export-prod-db -- -p=<YOUR_PROD_DB_PASSWORD>
```
Exports your production data to a folder `seed-data`. This data can then be used to make your local and staging server databases the exact same as production. This allows you to debug and test with real data.


```
npm run seed-staging-db
```
Replaces your staging db with the database dump in `seed-data`.


```
npm run seed-db
```
Replaces your local db with the database dump in `seed-data`.
