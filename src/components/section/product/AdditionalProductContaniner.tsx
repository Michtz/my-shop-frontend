const ImageContainer: FC = () => {
  return (
    <Image
      src={product?.imageUrl as string}
      alt={product?.name || 'Product image'}
      fill
      className={style.productImage}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={false}
    />
  );
};
