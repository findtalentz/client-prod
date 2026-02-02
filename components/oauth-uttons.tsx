import AppleLogin from "./apple-login";
import FacebookLogin from "./facebook-login";
import GoogleLogin from "./google-login";

interface Props {
  message: string;
}

function OauthButtons({ message }: Props) {
  return (
    <div className="space-y-3 pb-6">
      <div className="w-full flex items-center justify-between gap-3">
        <div className="flex-1 h-px bg-gray-400" />
        <p>{message}</p>
        <div className="flex-1 h-px bg-gray-400" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <GoogleLogin />
        <FacebookLogin />
        <AppleLogin />
      </div>
    </div>
  );
}

export default OauthButtons;
