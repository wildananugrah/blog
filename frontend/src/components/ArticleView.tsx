import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ArticleViewProps {
  content: string
}

export default function ArticleView({ content }: ArticleViewProps) {
  if (!content) {
    return (
      <div className="text-gray-500 italic">
        No content available.
      </div>
    )
  }

  return (
    <div className="prose prose-gray max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mb-4 mt-8 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-semibold mb-3 mt-6">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mb-3 mt-5">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-medium mb-2 mt-4">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 mb-4 italic text-gray-600">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              )
            }
            return (
              <code className="text-sm font-mono">{children}</code>
            )
          },
          pre: ({ children }) => (
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 overflow-x-auto">
              {children}
            </pre>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <figure className="mb-4">
              <img
                src={src}
                alt={alt || ''}
                className="rounded-lg max-w-full"
              />
              {alt && (
                <figcaption className="text-sm text-gray-500 text-center mt-2">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
          hr: () => <hr className="my-8 border-gray-200" />,
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border border-gray-200">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
