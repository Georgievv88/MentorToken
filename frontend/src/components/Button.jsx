function Button({ href, children, variant = "primary" }) {
  return (
    <a href={href} className={`button button-${variant}`}>
      {children}
    </a>
  );
}

export default Button;
