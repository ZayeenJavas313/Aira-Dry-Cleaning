interface LogoProps {
  className?: string;
}

export function Logo({ className = 'w-6 h-6' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      fill="currentColor"
      className={className}
      aria-label="Aira Laundry logo"
    >
      {/* Hanger shape */}
      <path d="M128 40c-13.3 0-24 10.7-24 24 0 8.8 4.7 16.5 11.8 20.7L44 148c-6 4.5-8 12.5-4.8 19.2C42.4 174 49.6 178 57.2 178H198.8c7.6 0 14.8-4 18-10.8 3.2-6.7 1.2-14.7-4.8-19.2L140.2 84.7c7-4.2 11.8-11.9 11.8-20.7 0-13.3-10.7-24-24-24zm0 16c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3.6-8 8-8zM128 96l76 56H52l76-56z" />
      {/* T-shirt below */}
      <path d="M80 190h96v8c0 4.4-3.6 8-8 8H88c-4.4 0-8-3.6-8-8v-8zm-8 24h112v8c0 4.4-3.6 8-8 8H80c-4.4 0-8-3.6-8-8v-8zm16 24h80v8c0 4.4-3.6 8-8 8H96c-4.4 0-8-3.6-8-8v-8z" />
    </svg>
  );
}
