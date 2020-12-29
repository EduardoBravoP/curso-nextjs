import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';
import { Title } from '@/styles/pages/Home';
import SEO from '@/components/SEO';
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { client } from '@/lib/prismic';
import { Document } from 'prismic-javascript/types/documents';

interface HomeProps {
  recommendedProducts: Document[];
}

const Home = ({ recommendedProducts }: HomeProps) => {
  return (
    <div>
      <SEO
        title="DevCommerce, the best e-commerce"
        shouldExcludeTitleSuffix
        image="boost.png"
      />

      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                <Link href={`/catalog/products/${recommendedProduct.uid}`}>
                  <a>
                    {PrismicDOM.RichText.asText(recommendedProduct.data.title)}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product'),
  ]);

  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    },
  };
};
