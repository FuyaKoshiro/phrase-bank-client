"use client";

import { useSignUpWithGoogle } from "@/hooks/auth/auth";
import { Button, Card, Tooltip, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import GoogleIcon from "@mui/icons-material/Google";
import { useAnimateKeyframes } from "react-simple-animate";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [isEmailCopied, setIsEmailCopied] = useState(false);

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

  async function handleClickCopyEmail() {
    navigator.clipboard.writeText("fuyakoshiro@gmail.com");
    setIsEmailCopied(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsEmailCopied(false);
  }

  const githubUrl = "https://github.com/FuyaKoshiro/phrase-bank-ts";

  return (
    <div className="flex flex-col px-5 lg:px-28 py-5 lg:py-14">
      {/* <div className="flex flex-row justify-between items-center">
        <Typography variant="h5">Phrase Bank</Typography>
        <Button
          variant="outlined"
          onClick={handleClickLoginWithGoogleButton}
          className="flex flex-row items-center gap-2"
        >
          <GoogleIcon />
          Login With Google
        </Button>
      </div>

      <div className="h-20" />

      <div className="flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-2/5 flex flex-col gap-5">
          <Typography variant="h1">Save Clips And Come Back Anytime</Typography>
          <Typography variant="h5" className="">
            More convinient YouTube Experience
          </Typography>
          <Typography variant="paragraph">
            Save clips from your favorite YouTube videos and come back to them
            anytime you want. Click on the login button to get started!
          </Typography>
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
          <Typography variant="h3">Easy Click to Save Clips</Typography>
        </div>
      </div>

      <div className="h-5 lg:h-20" />

      <div className="flex flex-row gap-5">
        <Card className="w-1/2 py-5 px-5 flex flex-col justify-center items-start border shadow-none">
          <Typography variant="h6" className="text-black">
            Usecase 1
          </Typography>
          <Typography variant="paragraph">
            Save favirote clips from your favorite YouTube videos and come back.
          </Typography>
        </Card>
        <Card className="w-1/2 py-5 px-5 flex flex-col justify-center items-start border shadow-none">
          <Typography variant="h6" className="text-black">
            Usecase 2
          </Typography>
          <Typography variant="paragraph">
            Save English phrases that you want to remember and come back.
          </Typography>
        </Card>
      </div>

      <div className="h-20" />

      <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 border-t border-blue-gray-50 py-6 text-center md:justify-between">
        <Typography color="blue-gray" className="font-normal">
          &copy; 2024 Fuya Koshiro
        </Typography>
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <li>
            <Typography
              as="a"
              href={githubUrl}
              className="font-normal transition-colors hover:text-gray-300 focus:text-gray-300"
            >
              Contribute
            </Typography>
          </li>
          <li>
            <Tooltip content={isEmailCopied ? "Email Copied" : "Copy Email"}>
              <Typography
                onClick={handleClickCopyEmail}
                as="a"
                className="font-normal transition-colors hover:text-gray-300 focus:text-gray-300 hover:cursor-pointer"
              >
                Contact Me!
              </Typography>
            </Tooltip>
          </li>
        </ul>
      </footer> */}
    </div>
  );
}
