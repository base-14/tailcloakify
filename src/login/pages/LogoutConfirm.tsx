import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function LogoutConfirm(props: PageProps<Extract<KcContext, { pageId: "logout-confirm.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, client, logoutConfirm } = kcContext;

    const { msg, msgStr } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={msg("logoutConfirmTitle")}>
            <div id="kc-logout-confirm" className="content-area">
                <p className="instruction">{msg("logoutConfirmHeader")}</p>
                <form className="form-actions" action={url.logoutConfirmAction} method="POST">
                    <input type="hidden" name="session_code" value={logoutConfirm.code} />
                    <div className={kcClsx("kcFormGroupClass")}>
                        <div id="kc-form-options">
                            <div className={kcClsx("kcFormOptionsWrapperClass")}></div>
                        </div>
                        <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                            <input
                                tabIndex={4}
                                className={
                                    "items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full"
                                }
                                name="confirmLogout"
                                id="kc-logout"
                                type="submit"
                                value={msgStr("doLogout")}
                            />
                        </div>
                    </div>
                </form>
                <div id="kc-info-message">
                    {!logoutConfirm.skipLink && client.baseUrl && (
                        <p className={"text-center"}>
                            <a href={client.baseUrl} className={"no-underline hover:no-underline text-primary hover:text-primary/80 text-sm"}>
                                {msg("backToApplication")}
                            </a>
                        </p>
                    )}
                </div>
            </div>
        </Template>
    );
}
