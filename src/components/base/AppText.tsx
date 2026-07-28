import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { typography } from '../../theme/typography';

export type TextVariant = 'display' | 'heading' | 'subheading' | 'body' | 'caption' | 'muted';
export type TextWeight = keyof typeof typography.weights;

export interface AppTextProps extends TextProps {
  tx?: string;
  txOptions?: Record<string, any>;
  variant?: TextVariant;
  color?: string;
  weight?: TextWeight;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const AppText: React.FC<AppTextProps> = ({
  tx,
  txOptions,
  variant = 'body',
  color,
  weight,
  align,
  style,
  children,
  ...props
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const content = tx ? t(tx, txOptions) : children;

  const getVariantStyle = () => {
    switch (variant) {
      case 'display':
        return { fontSize: typography.sizes.display, ...typography.weights.bold, color: colors.foreground };
      case 'heading':
        return { fontSize: typography.sizes.heading, ...typography.weights.bold, color: colors.foreground };
      case 'subheading':
        return { fontSize: typography.sizes.lg, ...typography.weights.semibold, color: colors.foreground };
      case 'caption':
        return { fontSize: typography.sizes.xs, ...typography.weights.regular, color: colors.textMuted };
      case 'muted':
        return { fontSize: typography.sizes.sm, ...typography.weights.regular, color: colors.textMuted };
      case 'body':
      default:
        return { fontSize: typography.sizes.md, ...typography.weights.regular, color: colors.foreground };
    }
  };

  return (
    <Text
      style={[
        getVariantStyle(),
        color ? { color } : undefined,
        weight ? typography.weights[weight] : undefined,
        align ? { textAlign: align } : undefined,
        style,
      ]}
      {...props}
    >
      {content}
    </Text>
  );
};
