import { getKcClsx, KcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { clsx } from "keycloakify/tools/clsx";

export default function LoginConfigTotp(
    props: PageProps<
        Extract<
            KcContext,
            {
                pageId: "login-config-totp.ftl";
            }
        >,
        I18n
    >
) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { url, isAppInitiatedAction, totp, mode, messagesPerField } = kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("loginTotpTitle")}
            displayMessage={!messagesPerField.existsError("totp", "userLabel")}
        >
            <>
                <div className="bg-destructive text-destructive-foreground p-4 rounded-lg text-sm mb-4" role="alert">
                    You need to set up Mobile Authenticator to activate your account.
                </div>
                <ol id="kc-totp-settings" className={"list-decimal pl-4 space-y-2 text-sm"}>
                    <li className={"space-y-2"}>
                        <p>{msg("loginTotpStep1")}</p>

                        <ul id="kc-totp-supported-apps" className={"list-disc pl-4"}>
                            {totp.supportedApplications.map(app => (
                                <li key={app}>{advancedMsg(app)}</li>
                            ))}
                        </ul>
                    </li>

                    {mode == "manual" ? (
                        <>
                            <li>
                                <p>{msg("loginTotpManualStep2")}</p>
                                <p>
                                    <br />
                                    <span id="kc-totp-secret-key">{totp.totpSecretEncoded}</span>
                                    <br />
                                </p>
                                <br />
                                <p>
                                    <a
                                        href={totp.qrUrl}
                                        id="mode-barcode"
                                        className={"text-primary hover:text-primary/90 inline-flex no-underline hover:no-underline"}
                                    >
                                        {msg("loginTotpScanBarcode")}
                                    </a>
                                </p>
                            </li>
                            <li>
                                <p>{msg("loginTotpManualStep3")}</p>
                                <ul>
                                    <li id="kc-totp-type">
                                        {msg("loginTotpType")}: {msg(`loginTotp.${totp.policy.type}`)}
                                    </li>
                                    <li id="kc-totp-algorithm">
                                        {msg("loginTotpAlgorithm")}: {totp.policy.getAlgorithmKey()}
                                    </li>
                                    <li id="kc-totp-digits">
                                        {msg("loginTotpDigits")}: {totp.policy.digits}
                                    </li>
                                    {totp.policy.type === "totp" ? (
                                        <li id="kc-totp-period">
                                            {msg("loginTotpInterval")}: {totp.policy.period}
                                        </li>
                                    ) : (
                                        <li id="kc-totp-counter">
                                            {msg("loginTotpCounter")}: {totp.policy.initialCounter}
                                        </li>
                                    )}
                                </ul>
                            </li>
                        </>
                    ) : (
                        <li>
                            <p>{msg("loginTotpStep2")}</p>
                            <img
                                className={"mx-auto"}
                                id="kc-totp-secret-qr-code"
                                src={`data:image/png;base64, ${totp.totpSecretQrCode}`}
                                alt="Figure: Barcode"
                            />
                            <br />
                            <p>
                                <a
                                    className={"text-primary hover:text-primary/90 inline-flex no-underline hover:no-underline"}
                                    href={totp.manualUrl}
                                    id="mode-manual"
                                >
                                    {msg("loginTotpUnableToScan")}
                                </a>
                            </p>
                        </li>
                    )}
                    <li>
                        <p>{msg("loginTotpStep3")}</p>
                    </li>
                    <li>
                        <p>{msg("loginTotpStep3DeviceName")}</p>
                    </li>
                </ol>

                <form action={url.loginAction} className={kcClsx("kcFormClass")} id="kc-totp-settings-form" method="post">
                    <div className={clsx(kcClsx("kcFormGroupClass"), "mt-4")}>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <label htmlFor="totp" className={kcClsx("kcLabelClass")}>
                                {msg("authenticatorCode")}
                            </label>{" "}
                            <span className="required">*</span>
                        </div>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <input
                                type="text"
                                id="totp"
                                name="totp"
                                autoComplete="off"
                                className={clsx(
                                    kcClsx("kcInputClass"),
                                    "block shadow-sm transition-colors border border-input mt-1 rounded-md w-full placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                )}
                                aria-invalid={messagesPerField.existsError("totp")}
                            />

                            {messagesPerField.existsError("totp") && (
                                <span
                                    id="input-error-otp-code"
                                    className={kcClsx("kcInputErrorMessageClass")}
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("totp"))
                                    }}
                                />
                            )}
                        </div>
                        <input type="hidden" id="totpSecret" name="totpSecret" value={totp.totpSecret} />
                        {mode && <input type="hidden" id="mode" value={mode} />}
                    </div>

                    <div className={kcClsx("kcFormGroupClass")}>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <label htmlFor="userLabel" className={kcClsx("kcLabelClass")}>
                                {msg("loginTotpDeviceName")}
                            </label>{" "}
                            {totp.otpCredentials.length >= 1 && <span className="required">*</span>}
                        </div>
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <input
                                type="text"
                                id="userLabel"
                                name="userLabel"
                                autoComplete="off"
                                className={clsx(
                                    kcClsx("kcInputClass"),
                                    "block shadow-sm transition-colors border border-input mt-1 rounded-md w-full placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                )}
                                aria-invalid={messagesPerField.existsError("userLabel")}
                            />
                            {messagesPerField.existsError("userLabel") && (
                                <span
                                    id="input-error-otp-label"
                                    className={kcClsx("kcInputErrorMessageClass")}
                                    aria-live="polite"
                                    dangerouslySetInnerHTML={{
                                        __html: kcSanitize(messagesPerField.get("userLabel"))
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <div className={kcClsx("kcFormGroupClass")}>
                        <LogoutOtherSessions kcClsx={kcClsx} i18n={i18n} />
                    </div>

                    {isAppInitiatedAction ? (
                        <>
                            <input
                                type="submit"
                                className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonLargeClass")}
                                id="saveTOTPBtn"
                                value={msgStr("doSubmit")}
                            />
                            <button
                                type="submit"
                                className={kcClsx("kcButtonClass", "kcButtonDefaultClass", "kcButtonLargeClass", "kcButtonLargeClass")}
                                id="cancelTOTPBtn"
                                name="cancel-aia"
                                value="true"
                            >
                                {msg("doCancel")}
                            </button>
                        </>
                    ) : (
                        <input
                            type="submit"
                            className={clsx(
                                kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass"),
                                "items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full"
                            )}
                            id="saveTOTPBtn"
                            value={msgStr("doSubmit")}
                        />
                    )}
                </form>
            </>
        </Template>
    );
}

function LogoutOtherSessions(props: { kcClsx: KcClsx; i18n: I18n }) {
    const { kcClsx, i18n } = props;

    const { msg } = i18n;

    return (
        <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
            <div className={kcClsx("kcFormOptionsWrapperClass")}>
                <div className="checkbox">
                    <label className={"ml-2 text-secondary text-sm"}>
                        <input
                            type="checkbox"
                            className={
                                "rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            }
                            id="logout-sessions"
                            name="logout-sessions"
                            value="on"
                            defaultChecked={true}
                        />
                        {msg("logoutOtherSessions")}
                    </label>
                </div>
            </div>
        </div>
    );
}
