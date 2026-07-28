import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { AppText } from './AppText';
import { AppView } from './AppView';
import { screenUtils } from '../../utils';
import { FONTS } from '../../utils/fontConstants';

export interface AppHeadingBlockProps {
  /** Literal title text */
  title?: string;
  /** Translation key for title text */
  titleTx?: string;
  /** Translation options for title */
  titleTxOptions?: Record<string, any>;
  /** Literal subtitle text */
  subtitle?: string;
  /** Translation key for subtitle text */
  subtitleTx?: string;
  /** Translation options for subtitle */
  subtitleTxOptions?: Record<string, any>;
  /** Alignment of heading content: 'left' | 'center' | 'right' */
  align?: 'left' | 'center' | 'right';
  /** Font weight of title text */
  titleWeight?: 'bold' | 'semibold' | 'medium' | 'regular';
  /** Font size of title text (defaults to scaleFont(24)) */
  titleSize?: number;
  /** Font size of subtitle text (defaults to scaleFont(14)) */
  subtitleSize?: number;
  /** Optional icon or element rendered above or alongside title */
  icon?: React.ReactNode;
  /** Optional right action element (button, link, badge) */
  rightElement?: React.ReactNode;
  /** Custom container style override */
  containerStyle?: ViewStyle;
  /** Custom title text style override */
  titleStyle?: TextStyle;
  /** Custom subtitle text style override */
  subtitleStyle?: TextStyle;
  /** Vertical gap between title and subtitle */
  spacing?: number;
}

export const AppHeadingBlock: React.FC<AppHeadingBlockProps> = ({
  title,
  titleTx,
  titleTxOptions,
  subtitle,
  subtitleTx,
  subtitleTxOptions,
  align = 'left',
  titleWeight = 'bold',
  titleSize = screenUtils.scaleFont(24),
  subtitleSize = screenUtils.scaleFont(14),
  icon,
  rightElement,
  containerStyle,
  titleStyle,
  subtitleStyle,
  spacing = screenUtils.scaleHeight(4),
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const resolvedTitle = titleTx ? t(titleTx, titleTxOptions) : title;
  const resolvedSubtitle = subtitleTx ? t(subtitleTx, subtitleTxOptions) : subtitle;

  const getAlignItems = () => {
    if (align === 'center') return 'center';
    if (align === 'right') return 'flex-end';
    return 'flex-start';
  };

  const getTextAlign = (): TextStyle['textAlign'] => {
    return align;
  };

  return (
    <AppView style={[styles.container, { alignItems: getAlignItems() }, containerStyle]}>
      {icon ? <AppView style={styles.iconContainer}>{icon}</AppView> : null}

      <AppView style={styles.headerTextRow}>
        <AppView style={[styles.textWrapper, { alignItems: getAlignItems() }]}>
          {resolvedTitle ? (
            <AppText
              weight={titleWeight}
              style={[
                styles.title,
                {
                  fontSize: titleSize,
                  color: colors.foreground,
                  textAlign: getTextAlign(),
                },
                titleStyle,
              ]}
            >
              {resolvedTitle}
            </AppText>
          ) : null}

          {resolvedSubtitle ? (
            <AppText
              variant="muted"
              style={[
                styles.subtitle,
                {
                  fontSize: subtitleSize,
                  marginTop: resolvedTitle ? spacing : 0,
                  textAlign: getTextAlign(),
                },
                subtitleStyle,
              ]}
            >
              {resolvedSubtitle}
            </AppText>
          ) : null}
        </AppView>

        {rightElement ? <AppView style={styles.rightElement}>{rightElement}</AppView> : null}
      </AppView>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  iconContainer: {
    marginBottom: screenUtils.scaleHeight(8),
  },
  headerTextRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.GEIST_BOLD,
    lineHeight: screenUtils.scaleHeight(32),
  },
  subtitle: {
    fontFamily: FONTS.GEIST_REGULAR,
    lineHeight: screenUtils.scaleHeight(20),
  },
  rightElement: {
    marginLeft: screenUtils.scaleWidth(12),
    alignSelf: 'center',
  },
});
