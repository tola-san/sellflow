type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
};

export function BrandLogo({ className = "", markClassName = "h-9 w-9", wordmarkClassName = "text-lg", showWordmark = true }: BrandLogoProps) {
  return <span className={`inline-flex items-center gap-2.5 ${className}`}>
    <img src="/brand/sellflow-mark.svg" alt="" aria-hidden="true" className={`shrink-0 ${markClassName}`} />
    {showWordmark && <span className={`font-bold tracking-[-0.045em] text-[#18171d] ${wordmarkClassName}`}>Sell<span className="text-[#7657e8]">Flow</span></span>}
  </span>;
}
