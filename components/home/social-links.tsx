import { FaDiscord, FaEnvelope, FaGithub } from "react-icons/fa6";

type SocialLinksProps = {
  className?: string;
};

export default function SocialLinks({ className }: SocialLinksProps) {
  return (
    <div className={className}>
      <a href="https://github.com/twiston-7" target="_blank" rel="noreferrer" aria-label="GitHub">
        <FaGithub />
      </a>
      <a
        href="https://discord.com/users/855798460593733652"
        target="_blank"
        rel="noreferrer"
        aria-label="Discord"
      >
        <FaDiscord />
      </a>
      <a href="mailto:twiston7@proton.me" target="_blank" rel="noreferrer" aria-label="Email">
        <FaEnvelope />
      </a>
    </div>
  );
}

