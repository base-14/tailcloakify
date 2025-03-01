import React, { useEffect, useRef, useState } from "react";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { clsx } from "keycloakify/tools/clsx";

export default function LoginOtp(props: PageProps<Extract<KcContext, { pageId: "login-otp.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { otpLogin, url, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const otpLength = 6;
    const inputRef = useRef<HTMLInputElement[]>(Array(otpLength).fill(null));

    const [otpValues, setOtpValues] = useState<string[]>(Array(otpLength).fill(""));

    useEffect(() => {
        if (otpValues.every(Boolean)) {
            (document.getElementById("kc-otp-login-form") as HTMLFormElement)?.submit();
        }
    }, [otpValues]);

    const handleInput = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;

        // Only accept single digit input
        if (target.value.length > 1) {
            target.value = target.value.slice(-1);
        }

        if (isNaN(Number(target.value))) {
            target.value = "";
            return;
        }

        const newOtpValues = [...otpValues];
        newOtpValues[index] = target.value;
        setOtpValues(newOtpValues);

        // Move focus to the next input field if the current one is filled
        if (target.value !== "" && index < otpLength - 1) {
            const next = inputRef.current[index + 1];
            if (next) {
                next.focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasteData = e.clipboardData.getData("text").trim();

        if (!/^\d+$/.test(pasteData)) return; // Ensure only numbers are pasted

        const values = pasteData.split("").slice(0, otpLength);
        const newOtpValues = [...otpValues];

        values.forEach((value, i) => {
            newOtpValues[i] = value;
            if (inputRef.current[i]) {
                inputRef.current[i].value = value;
            }
        });

        setOtpValues(newOtpValues);

        // Focus the last filled input after pasting
        const lastIndex = Math.min(values.length, otpLength);
        if (inputRef.current[lastIndex]) {
            inputRef.current[lastIndex].focus();
        } else inputRef.current[otpLength - 1].focus();

        e.preventDefault(); // Prevent default paste action
    };

    const handleKeyUp = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const key = e.key.toLowerCase();

        if (key === "backspace" || key === "delete") {
            target.value = "";
            const prev = inputRef.current[index - 1];
            if (prev) {
                prev.focus();
            }

            const newOtpValues = [...otpValues];
            newOtpValues[index] = "";
            setOtpValues(newOtpValues);
        }
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("totp")}
            headerNode={msg("doLogIn")}
        >
            <form id="kc-otp-login-form" className={kcClsx("kcFormClass")} action={url.loginAction} method="post">
                {otpLogin.userOtpCredentials.length > 1 && <div className={kcClsx("kcFormGroupClass")}></div>}

                <div className={kcClsx("kcFormGroupClass")}>
                    <div className={clsx(kcClsx("kcLabelWrapperClass"), "text-center font-bold text-lg p-4")}>
                        <label htmlFor="otp" className={kcClsx("kcLabelClass")}>
                            Please Input your {msg("loginOtpOneTime")}
                        </label>
                    </div>
                    <div className={kcClsx("kcInputWrapperClass")} id={"inputs"}>
                        <div className={"flex justify-center items-center"}>
                            {Array.from({ length: otpLength }).map((_, index) => (
                                <input
                                    key={index}
                                    className={"otp-input"}
                                    type="text"
                                    autoFocus={index === 0}
                                    autoComplete="off"
                                    name={`otp-${index}`}
                                    id={`otp-${index}`}
                                    inputMode="numeric"
                                    value={otpValues[index]}
                                    onChange={handleInput(index)}
                                    ref={el => (inputRef.current[index] = el as HTMLInputElement)}
                                    onKeyDown={handleKeyUp(index)}
                                    onPaste={handlePaste}
                                />
                            ))}
                        </div>
                        <input
                            id={"otp"}
                            name={"otp"}
                            autoComplete="off"
                            type={"hidden"}
                            value={otpValues.join("")}
                            className={clsx(
                                kcClsx("kcInputClass"),
                                "block shadow-sm transition-colors border border-input mt-1 rounded-md w-full placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            )}
                            autoFocus={true}
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
                </div>

                <div className={kcClsx("kcFormGroupClass")}>
                    <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}></div>
                    </div>
                    <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                        <input
                            className={clsx(
                                kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass"),
                                "items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 w-full"
                            )}
                            name="login"
                            id="kc-login"
                            type="submit"
                            value={msgStr("doLogIn")}
                        />
                    </div>
                </div>
            </form>
        </Template>
    );
}
