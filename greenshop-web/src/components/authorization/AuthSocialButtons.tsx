import { socialAccountWays } from "./utils/authUtils";
import Button from "../../reusable/button/Button";
import type { AuthSocialButtonsProps } from "./types/authTypes";

function AuthSocialButtons({ activatedId }: AuthSocialButtonsProps) {
  const actionTypeText = activatedId === 1 ? "Login" : "Continue";
  return (
    <>
      {socialAccountWays.map((item) => (
        <Button className="authorization__form-social-button" key={item.id}>
          <img
            src={item.src}
            alt={item.alt}
            className="authorization__form-social-image"
          />
          <span>
            {actionTypeText} with {item.alt}
          </span>
        </Button>
      ))}
    </>
  );
}

export default AuthSocialButtons;