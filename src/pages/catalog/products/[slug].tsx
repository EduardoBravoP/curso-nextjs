import React from 'react';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { client } from '@/lib/prismic';
import { Title } from '@/styles/pages/Home';

interface ProductProps {
  product: Document;
}

const Product = ({ product }: ProductProps) => {
  const router = useRouter();

  if (router.isFallback) {
    return <Title>Carregando...</Title>;
  }

  return (
    <div>
      <h1>{PrismicDOM.RichText.asText(product.data.title)}</h1>

      <img
        src={product.data.thumbnail.url}
        alt={product.data.title}
        width="300"
      />

      <div
        dangerouslySetInnerHTML={{
          __html: PrismicDOM.RichText.asHtml(product.data.description),
        }}
      />

      <p>
        Price: R$
        {product.data.price}
      </p>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<ProductProps> = async context => {
  const { slug } = context.params;

  const product = await client().getByUID('product', String(slug), {});

  return {
    props: {
      product,
    },
    revalidate: 10,
  };
};

export default Product;
