import type { ButtonHTMLAttributes, ReactNode } from 'react';
import {
  buttonBaseClass,
  buttonDangerClass,
  buttonGhostClass,
} from '../styles/ui';

type ButtonVariant = 'default' | 'danger' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly variant?: ButtonVariant;
  readonly children: ReactNode;
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  default: buttonBaseClass,
  danger: buttonDangerClass,
  ghost: buttonGhostClass,
};

export function Button({
  variant = 'default',
  className,
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  const classes = [VARIANT_CLASS[variant], className].filter(Boolean).join(' ');

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
