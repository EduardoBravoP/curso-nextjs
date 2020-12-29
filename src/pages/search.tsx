import React, { FormEvent, useCallback, useState } from 'react';
import { Document } from 'prismic-javascript/types/documents';
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { client } from '@/lib/prismic';
import Link from 'next/link';

interface SearchProps {
  searchResults: Document[];
}

const Search = ({ searchResults }: SearchProps) => {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      router.push(`/search?q=${encodeURIComponent(search)}`);

      setSearch('');
    },
    [router, search],
  );

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <ul>
        {searchResults.map(product => {
          return (
            <li key={product.id}>
              <Link href={`/catalog/products/${product.uid}`}>
                <a>{PrismicDOM.RichText.asText(product.data.title)}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<SearchProps> = async context => {
  const { q } = context.query;

  if (!q) {
    return { props: { searchResults: [] } };
  }

  const searchResults = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.fulltext('my.product.title', String(q)),
  ]);

  return { props: { searchResults: searchResults.results } };
};

export default Search;
