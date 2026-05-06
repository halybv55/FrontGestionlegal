type TitleProps = {
  children: React.ReactNode;
};

export default function Title({ children }: TitleProps) {
  return <h1 className="title">{children}</h1>;
}