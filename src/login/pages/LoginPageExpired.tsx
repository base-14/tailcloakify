import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LoginPageExpired(
    props: PageProps<
        Extract<
            KcContext,
            {
                pageId: "login-page-expired.ftl";
            }
        >,
        I18n
    >
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { url } = kcContext;

    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("pageExpiredTitle")}>
            <p id="instruction1" className="instruction text-center">
                {msg("pageExpiredMsg1")}{" "}
                <a
                    id="loginRestartLink"
                    href={url.loginRestartFlowUrl}
                    className={"text-primary hover:text-primary/90 inline-flex no-underline hover:no-underline"}
                >
                    {msg("doClickHere")}
                </a>
                <br />
                <br />
                {msg("pageExpiredMsg2")}{" "}
                <a
                    id="loginContinueLink"
                    href={url.loginAction}
                    className={"text-primary hover:text-primary/90 inline-flex no-underline hover:no-underline"}
                >
                    {msg("doClickHere")}
                </a>
            </p>
        </Template>
    );
}
