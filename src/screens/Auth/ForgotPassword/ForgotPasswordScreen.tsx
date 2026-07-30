import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import {
  AppButton,
  AppHeadingBlock,
  AppText,
  AppView,
  BaseContainer,
} from '../../../components/base';
import { AuthFooter, AuthTopBar, BackButton, FormInputField } from '../../../components/common';
import { LockIcon, MailIcon } from '../../../components/icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { RootStackParamList } from '../../../navigation/types';
import { screenUtils } from '../../../utils/screenUtils';
import { AuthValidationService, ForgotPasswordFormValues } from '../../../services';
import { styles } from './ForgotPasswordScreen.styles';

type Props = StackScreenProps<RootStackParamList, 'ForgotPassword'>;

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
    resolver: zodResolver(AuthValidationService.forgotPasswordSchema),
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
      loading={isSubmitting}
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
                  returnKeyType="done"
                  editable={!isSubmitting}
                  onSubmitEditing={handleSubmit(onValidSubmit)}
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
            disabled={!isValid || isSubmitting}
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
