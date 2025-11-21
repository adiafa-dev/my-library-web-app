import clsx from 'clsx';

type IconTextProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

type IconProps = {
  srcIcon: string;
  altIcon?: string;
  className?: string;
};

type TextProps = {
  children: React.ReactNode;
  className?: string;
};

const IconText = ({ children, className, id }: IconTextProps) => {
  return (
    <div className={clsx('flex items-center gap-3', className)} id={id}>
      {children}
    </div>
  );
};

const IconPart = ({
  srcIcon,
  altIcon = 'Image Icon',
  className,
}: IconProps) => {
  return (
    <>
      <img src={srcIcon} alt={altIcon} className={clsx('', className)} />
    </>
  );
};

const TextPart = ({ children, className }: TextProps) => {
  return <p className={clsx('', className)}>{children}</p>;
};

IconText.Icon = IconPart;
IconText.Text = TextPart;

export default IconText;
