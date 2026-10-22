import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

type Logo = {
  src: StaticImageData | string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div">;

export function CollaborateLogo({ className, ...props }: LogoCloudProps) {
  return (
    <div
      className={cn(
        "relative grid grid-cols-2 border-x md:grid-cols-4",
        className,
      )}
      {...props}
    >
      {/* These w-screen lines will now render correctly and won't cause a scrollbar because of the body overflow-x-hidden */}
      <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t" />

      <LogoCard
        className="relative border-r border-b bg-secondary dark:bg-secondary/30"
        logo={{
          src: "/Apollo.webp",
          alt: "Apollo Hospital",
        }}
      >
        <PlusIcon
          className="right-[-12.5px] bottom-[-12.5px] absolute z-10 size-6"
          strokeWidth={1}
        />
      </LogoCard>

      <LogoCard
        className="border-b md:border-r"
        logo={{
          src: "/Birdem.webp",
          alt: "Birdem hospital",
        }}
      />

      <LogoCard
        className="relative border-r border-b md:bg-secondary dark:md:bg-secondary/30"
        logo={{
          src: "/BSMMC.webp",
          alt: "BSMMC",
        }}
      >
        <PlusIcon
          className="right-[-12.5px] bottom-[-12.5px] absolute z-10 size-6"
          strokeWidth={1}
        />
        <PlusIcon
          className="bottom-[-12.5px] left-[-12.5px] absolute z-10 hidden size-6 md:block"
          strokeWidth={1}
        />
      </LogoCard>

      <LogoCard
        className="relative border-b bg-secondary md:bg-background dark:bg-secondary/30 md:dark:bg-background"
        logo={{
          src: "/DMC.webp",
          alt: "DMC",
        }}
      />

      <LogoCard
        className="relative border-r border-b bg-secondary md:border-b-0 md:bg-background dark:bg-secondary/30 md:dark:bg-background"
        logo={{
          src: "/IbnSina.webp",
          alt: "Ibn Sina",
        }}
      >
        <PlusIcon
          className="right-[-12.5px] bottom-[-12.5px] md:left-[-12.5px] absolute z-10 size-6 md:hidden"
          strokeWidth={1}
        />
      </LogoCard>

      <LogoCard
        className="border-b bg-background md:border-r md:border-b-0 md:bg-secondary dark:md:bg-secondary/30"
        logo={{
          src: "/Labaid.webp",
          alt: "Labaid",
        }}
      />

      <LogoCard
        className="border-r"
        logo={{
          src: "/Popular.webp",
          alt: "Popular",
        }}
      />

      <LogoCard
        className="bg-secondary dark:bg-secondary/30"
        logo={{
          src: "/Siloam.webp",
          alt: "Siloam",
        }}
      />

      <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b" />
    </div>
  );
}

type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Logo;
};

function LogoCard({ logo, className, children, ...props }: LogoCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-background px-4 py-8 md:p-8",
        className,
      )}
      {...props}
    >
      <Image
        alt={logo.alt}
        width={200}
        height={200}
        className="w-14 h-14 select-none md:h-14 dark:brightness-0 dark:invert object-contain"
        src={logo.src}
      />
      {children}
    </div>
  );
}
