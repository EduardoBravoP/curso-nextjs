import React from 'react';
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';

import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { client } from '@/lib/prismic';
import Link from 'next/link';
import { Title } from '../../../styles/pages/Home';

interface CategoryProps {
  category: Document;
  products: Document[];
}

const Category = ({ products, category }: CategoryProps) => {
  const router = useRouter();

  if (router.isFallback) {
    return <Title>Carregando...</Title>;
  }

  return (
    <section>
      <h1>{PrismicDOM.RichText.asText(category.data.title)}</h1>

      <ul>
        {products.map(product => {
          return (
            <li key={product.id}>
              <Link href={`/catalog/products/${product.uid}`}>
                <a>{PrismicDOM.RichText.asText(product.data.title)}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Category;

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await client().query([
    Prismic.Predicates.at('document.type', 'category'),
  ]);

  const paths = categories.results.map(category => {
    return {
      params: {
        slug: category.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<CategoryProps> = async context => {
  const { slug } = context.params;

  const category = await client().getByUID('category', String(slug), {});

  const products = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
    Prismic.Predicates.at('my.product.category', category.id),
  ]);

  return {
    props: {
      category,
      products: products.results,
    },
    revalidate: 60,
  };
};
