import { Hono } from 'hono'
import * as articleService from '../services/articleService'

const articles = new Hono()

// GET /api/articles - List articles with search and pagination
articles.get('/', async (c) => {
  const search = c.req.query('search') || undefined
  const tag = c.req.query('tag') || undefined
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '10')

  const result = await articleService.getAllArticles({ search, tag, page, limit })
  return c.json(result)
})

// GET /api/articles/:slug - Get single article with markdown content
articles.get('/:slug', async (c) => {
  const slug = c.req.param('slug')
  const article = await articleService.getArticleBySlug(slug)

  if (!article) {
    return c.json({ error: 'Article not found' }, 404)
  }

  return c.json(article)
})

export default articles
