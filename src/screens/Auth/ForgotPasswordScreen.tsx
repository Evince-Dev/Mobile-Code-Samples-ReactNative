import { zodResolver } from '@hookform/resolvers/zod';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { z } from 'zod';

import {
  AppButton,
  AppHeadingBlock,
  AppText,
  AppView,
  BaseContainer
} from '../../components/base';
import { AuthFooter, AuthTopBar, BackButton, FormInputField } from '../../components/common';
import {
  LockIcon,
  MailIcon
} from '../../components/icons';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList } from '../../navigation/types';
import { FONTS } from '../../utils/fontConstants';
import { screenUtils } from '../../utils/screenUtils';

type Props = StackScreenProps<RootStackParamList, 'ForgotPassword'>;

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'auth.emailRequired' })
    .email({ message: 'auth.invalidEmail' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [isSent, setIsSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });



  const onValidSubmit = async (data: ForgotPasswordFormValues) => {
    setSubmittedEmail(data.email);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1500));
    setIsSent(true);
  };

  return (
    <BaseContainer
      scrollable
      avoidKeyboard
      safeAreaViewStyle={{ backgroundColor: colors.background }}
      horizontalPadding={screenUtils.scaleWidth(24)}
      verticalPadding={screenUtils.scaleHeight(16)}
    >
      {/* ── Top Bar ── */}
      <AuthTopBar />

      {/* ── Back Button ── */}
      <BackButton />

      {!isSent ? (
        <AppView style={styles.contentBlock}>
          {/* ── Lock Icon Container ── */}
          <AppView style={[styles.lockIconContainer, { backgroundColor: colors.primary + '18' }]}>
            <LockIcon width={24} height={24} color={colors.primary} />
          </AppView>

          {/* ── Heading Block ── */}
          <AppHeadingBlock
            titleTx="auth.resetPasswordTitle"
            subtitleTx="auth.resetPasswordSubtitle"
            containerStyle={styles.headingBlock}
          />

          {/* ── Form Inputs ── */}
          <AppView style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormInputField
                  labelTx="auth.emailLabel"
                  placeholderTx="auth.emailPlaceholder"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorTx={errors.email?.message}
                />
              )}
            />
          </AppView>

          {/* ── Send Reset Link Button ── */}
          <AppButton
            size="lg"
            tx="auth.sendResetLink"
            onPress={handleSubmit(onValidSubmit)}
            disabled={!isValid}
            loading={isSubmitting}
            style={styles.submitBtn}
          />
        </AppView>
      ) : (
        <AppView style={styles.sentContentBlock}>
          {/* ── Mail Sent Circle Container ── */}
          <AppView style={[styles.mailIconContainer, { backgroundColor: colors.primary + '1A' }]}>
            <MailIcon width={32} height={32} color={colors.primary} />
          </AppView>

          {/* ── Sent Heading Block ── */}
          <AppView style={styles.sentHeaderBlock}>
            <AppText style={styles.sentHeading} color={colors.foreground}>
              {t('auth.checkYourEmail')}
            </AppText>
            <AppText style={styles.sentSubheading} color={colors.textMuted}>
              {t('auth.resetEmailSent')}{'\n'}
              <AppText style={styles.sentEmailText} color={colors.foreground}>
                {submittedEmail}
              </AppText>
            </AppText>
          </AppView>

          {/* ── Information Callout Card ── */}
          <AppView style={[styles.calloutCard, { backgroundColor: colors.secondary }]}>
            <AppText style={styles.calloutText} color={colors.textMuted}>
              {t('auth.didntGetIt')}{' '}
              <AppText
                style={styles.tryAgainText}
                color={colors.primary}
                onPress={() => setIsSent(false)}
              >
                {t('auth.tryAgain')}
              </AppText>
            </AppText>
          </AppView>
        </AppView>
      )}

      {/* ── Footer ── */}
      <AuthFooter />
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  // Back button
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenUtils.scaleWidth(6),
    marginBottom: screenUtils.scaleHeight(44),
    paddingVertical: 4,
  },
  backText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(14),
  },

  // Content Container
  contentBlock: {
    width: '100%',
  },

  // Lock Icon Box
  lockIconContainer: {
    width: screenUtils.scaleSize(48),
    height: screenUtils.scaleSize(48),
    borderRadius: screenUtils.scaleSize(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenUtils.scaleHeight(16),
    marginTop: screenUtils.scaleHeight(16),
  },

  // Headings
  headingBlock: {
    marginBottom: screenUtils.scaleHeight(24),
  },
  heading: {
    fontFamily: FONTS.GEIST_SEMI_BOLD,
    fontSize: screenUtils.scaleFont(24),
    marginBottom: screenUtils.scaleHeight(6),
  },
  subheading: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(14),
    lineHeight: screenUtils.scaleFont(14) * 1.4,
  },

  // Form
  form: {
    marginBottom: screenUtils.scaleHeight(8),
  },

  // Submit Button
  submitBtn: {
    marginTop: screenUtils.scaleHeight(8),
  },

  // Sent State
  sentContentBlock: {
    width: '100%',
    alignItems: 'center',
  },
  mailIconContainer: {
    width: screenUtils.scaleSize(64),
    height: screenUtils.scaleSize(64),
    borderRadius: screenUtils.scaleSize(32),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenUtils.scaleHeight(20),
    marginTop: screenUtils.scaleHeight(40),
  },
  sentHeaderBlock: {
    alignItems: 'center',
    marginBottom: screenUtils.scaleHeight(24),
  },
  sentHeading: {
    fontFamily: FONTS.GEIST_SEMI_BOLD,
    fontSize: screenUtils.scaleFont(24),
    textAlign: 'center',
    marginBottom: screenUtils.scaleHeight(8),
  },
  sentSubheading: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(14),
    textAlign: 'center',
    lineHeight: screenUtils.scaleFont(14) * 1.5,
  },
  sentEmailText: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(14),
  },

  // Callout
  calloutCard: {
    width: '100%',
    borderRadius: screenUtils.scaleSize(14),
    padding: screenUtils.scaleSize(16),
    marginBottom: screenUtils.scaleHeight(24),
    marginTop: screenUtils.scaleHeight(24),
  },
  calloutText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(13),
    textAlign: 'center',
    lineHeight: screenUtils.scaleFont(13) * 1.5,
  },
  tryAgainText: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(13),
  },
});
