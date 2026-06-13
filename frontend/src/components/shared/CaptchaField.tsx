"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { generateCaptchaText } from "@/lib/auth-utils";
import { onInputBlur, onInputFocus } from "@/components/register/form-utils";

interface CaptchaFieldProps {
  value: string;
  onChange: (value: string) => void;
  onValidChange: (valid: boolean) => void;
}

export default function CaptchaField({ value, onChange, onValidChange }: CaptchaFieldProps) {
  const [code, setCode] = useState("");

  const refresh = useCallback(() => {
    const next = generateCaptchaText(5);
    setCode(next);
    onChange("");
    onValidChange(false);
  }, [onChange, onValidChange]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    onValidChange(value.toUpperCase() === code);
  }, [value, code, onValidChange]);

  return (
    <div className="reg-captcha">
      <label htmlFor="captcha" className="reg-label">Captcha Verification</label>
      <div className="reg-captcha__row">
        <div className="reg-captcha__image" aria-hidden="true">
          {code.split("").map((ch, i) => (
            <span
              key={`${code}-${i}`}
              style={{
                transform: `rotate(${i % 2 === 0 ? -8 : 8}deg)`,
                color: i % 2 === 0 ? "#1E40AF" : "#2563EB",
              }}
            >
              {ch}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="reg-captcha__refresh"
          onClick={refresh}
          aria-label="Refresh captcha"
        >
          <RefreshCw size={18} />
        </button>
        <input
          id="captcha"
          type="text"
          className="reg-input reg-captcha__input"
          placeholder="Enter captcha"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          autoComplete="off"
          required
        />
      </div>
    </div>
  );
}
