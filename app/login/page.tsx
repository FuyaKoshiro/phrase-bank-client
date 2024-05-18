"use client";

import { useSignUpWithGoogle } from "@/hooks/auth/auth";
import { useRouter } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";
import { useAnimateKeyframes } from "react-simple-animate";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typographyH1";
import { TypographyH4 } from "@/components/ui/typographyH4";
import { TypographyP } from "@/components/ui/typographyP";
import { TypographySmall } from "@/components/ui/typographySmall";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function LoginPage() {
  const signUpWithGoogleResult = useSignUpWithGoogle();

  const router = useRouter();

  const { play, style } = useAnimateKeyframes({
    iterationCount: "infinite",
    direction: "alternate",
    duration: 5,
    keyframes: [
      "transform: rotateX(0) rotateY(0) rotateZ(0)",
      "transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg)",
    ],
  });

  useEffect(() => {
    play(true);
  }, [play]);

  async function handleClickLoginWithGoogleButton() {
    const { user } = await signUpWithGoogleResult.mutateAsync();
    if (user) {
      router.push("/");
    } else {
      router.push("/login");
    }
  }

  async function handleClickCopyEmail(email: string) {
    navigator.clipboard.writeText(email);
    toast("Email copied to clipboard!");
  }

  const githubUrl = "https://github.com/FuyaKoshiro/phrase-bank";
  const email = "fuyakoshiro@gmail.com";

  function handleClickGitHubButton(githubUrl: string) {
    window.open(githubUrl, "_blank");
  }

  return (
    <div className="w-screen flex flex-col px-5 lg:px-28 pt-5 pb-10 lg:py-14">
      <div className="flex flex-row justify-between items-center">
        <TypographyH4>Phrase Bank</TypographyH4>
        <Button
          onClick={handleClickLoginWithGoogleButton}
          className="hidden lg:flex flex-row items-center gap-2 py-7"
        >
          <GoogleIcon />
          <TypographySmall>Sign in with Google</TypographySmall>
        </Button>
        <Button
          onClick={handleClickLoginWithGoogleButton}
          className="lg:hidden text-sm flex flex-row gap-2"
        >
          <GoogleIcon />
          Sign in with Google
        </Button>
      </div>

      <div className="h-20" />

      <div className="flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-2/5 flex flex-col gap-5">
          <TypographyH1>Save Clips And Come Back Anytime</TypographyH1>
          <TypographyH4>More convinient YouTube Experience</TypographyH4>
          <TypographyP>
            Save clips from your favorite YouTube videos and come back to them
            anytime you want. Click on the login button to get started!
          </TypographyP>
        </div>

        <div className="block lg:hideen h-20" />

        <div className="w-full lg:w-3/5 flex flex-row justify-center">
          <div
            style={style}
            className="h-20 w-20 border-2 border-black flex flex-row justify-center items-center"
          >
            <div className="h-10 w-10 border border-black flex flex-row justify-center items-center">
              <div className="h-5 w-5 bg-black" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" />

      <div className="flex flex-col lg:flex-row items-center">
        <video className="w-full lg:w-1/2 rounded-lg" controls autoPlay muted>
          <source src="demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="w-full flex flex-col gap-2 px-10 py-20 lg:py-0 text-center">
          <TypographyH4>Easy Click to Save Clips</TypographyH4>
        </div>
      </div>

      <div className="h-5 lg:h-20" />

      <div className="flex flex-row gap-5">
        <Card className="w-1/2 py-5 px-5 flex flex-col justify-center items-start border shadow-none">
          <TypographyH4 className="text-black">Usecase 1</TypographyH4>
          <TypographyP>
            Save favirote clips from your favorite YouTube videos and come back.
          </TypographyP>
        </Card>
        <Card className="w-1/2 py-5 px-5 flex flex-col justify-center items-start border shadow-none">
          <TypographyH4 className="text-black">Usecase 2</TypographyH4>
          <TypographyP>
            Save English phrases that you want to remember and come back.
          </TypographyP>
        </Card>
      </div>

      <div className="h-20" />

      <Separator />

      <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 py-6 text-center md:justify-between">
        <TypographySmall className="font-normal">
          &copy; 2024 Fuya Koshiro
        </TypographySmall>
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <li>
            <Button
              variant="link"
              onClick={() => handleClickGitHubButton(githubUrl)}
            >
              Contribute
            </Button>
          </li>
          <li>
            <Button variant="link" onClick={() => handleClickCopyEmail(email)}>
              Contact me!
            </Button>
          </li>
        </ul>
      </footer>
    </div>
  );
}
