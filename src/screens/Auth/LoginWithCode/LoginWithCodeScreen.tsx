import React, { useRef, useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../../../navigation/types';
import {
  BaseContainer,
  AppText,
  AppButton,
  AppView,
  AppTouchableOpacity,
  AppHeadingBlock,
} from '../../../components/base';
import {
  FormInputField,
  AuthTopBar,
  AuthFooter,
  OTPInput,
  OTPInputRef,
  BackButton,
} from '../../../components/common';
import { useTheme } from '../../../contexts/ThemeContext';
import { screenUtils } from '../../../utils/screenUtils';
import { MailIcon } from '../../../components/icons';
import { useAppDispatch } from '../../../store';
import { setCredentials } from '../../../store/slices/authSlice';
import { StorageService, AuthValidationService, CodeFormValues } from '../../../services';
import { styles } from './LoginWithCodeScreen.styles';

type Props = StackScreenProps<RootStackParamList, 'LoginWithCode'>;

export const LoginWithCodeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [hasOtpError, setHasOtpError] = useState(false);

  // 60-Second OTP Countdown Timer State
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  const otpRef = useRef<OTPInputRef>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CodeFormValues>({
    resolver: zodResolver(AuthValidationService.codeFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const isAnyLoading = isSubmitting || isVerifying || isResending;

  // Format seconds to MM:SS string (e.g. 60 -> 01:00, 45 -> 00:45)
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start 60-second OTP countdown when code is sent or resent
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isCodeSent && !canResend) {
      setTimer(60);

      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setCanResend(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    } else if (!isCodeSent) {
      setTimer(60);
      setCanResend(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCodeSent, canResend]);

  const onSendCode = async (data: CodeFormValues) => {
    setSubmittedEmail(data.email);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1200));
    setIsCodeSent(true);
    setHasOtpError(false);
  };

  const onVerifyCode = async () => {
    if (otpCode.length < 6) return;
    setIsVerifying(true);
    setHasOtpError(false);

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1200));

    // Simulate wrong code on "000000"
    if (otpCode === '000000') {
      setIsVerifying(false);
      setHasOtpError(true);
      return;
    }

    setIsVerifying(false);
    const user = {
      id: 'usr_101',
      name: submittedEmail.split('@')[0],
      email: submittedEmail,
    };
    await StorageService.saveSecureItem('auth_token', 'code_mock_token');
    StorageService.setObject('auth_user', user);
    dispatch(setCredentials({ user }));
    navigation.replace('App');
  };

  const handleResendCode = async () => {
    if (!canResend || isAnyLoading) return;

    setIsResending(true);
    otpRef.current?.clear();
    setHasOtpError(false);
    setOtpCode('');

    // Simulate resending OTP email
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));

    setIsResending(false);
    setTimer(60);
    setCanResend(false);
  };

  return (
    <BaseContainer
      scrollable
      avoidKeyboard
      loading={isAnyLoading}
      safeAreaViewStyle={{ backgroundColor: colors.background }}
      horizontalPadding={screenUtils.scaleWidth(24)}
      verticalPadding={screenUtils.scaleHeight(16)}
    >
      {/* ── Top Bar ── */}
      <AuthTopBar />

      {/* ── Back Button ── */}
      <BackButton
        disabled={isAnyLoading}
        onPress={() => {
          if (isCodeSent) {
            setIsCodeSent(false);
            setHasOtpError(false);
            setOtpCode('');
          } else {
            navigation.goBack();
          }
        }}
      />

      {!isCodeSent ? (
        <AppView style={styles.contentBlock}>
          {/* ── Mail Icon Container ── */}
          <AppView
            style={[
              styles.mailIconContainer,
              { backgroundColor: colors.primary + '18' },
            ]}
          >
            <MailIcon width={24} height={24} color={colors.primary} />
          </AppView>

          {/* ── Heading Block ── */}
          <AppHeadingBlock
            titleTx="auth.signInWithCodeTitle"
            subtitleTx="auth.signInWithCodeSubtitle"
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
                  editable={!isAnyLoading}
                  onSubmitEditing={handleSubmit(onSendCode)}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorTx={errors.email?.message}
                />
              )}
            />
          </AppView>

          {/* ── Send Code Button ── */}
          <AppButton
            size="lg"
            tx="auth.sendCode"
            onPress={handleSubmit(onSendCode)}
            disabled={!isValid || isAnyLoading}
            loading={isSubmitting}
            style={styles.actionBtn}
          />
        </AppView>
      ) : (
        <AppView style={styles.contentBlock}>
          {/* ── Heading Block ── */}
          <AppView style={styles.headingBlock}>
            <AppText style={styles.heading} color={colors.foreground}>
              {t('auth.enterYourCodeTitle')}
            </AppText>
            <AppText style={styles.subheading} color={colors.textMuted}>
              {t('auth.sentTo')}{' '}
              <AppText style={styles.emailText} color={colors.foreground}>
                {submittedEmail}
              </AppText>
            </AppText>
          </AppView>

          {/* ── OTP Input ── */}
          <AppView style={styles.otpWrapper}>
            <OTPInput
              ref={otpRef}
              codeLength={6}
              hasError={hasOtpError}
              onCodeChanged={(code) => {
                setOtpCode(code);
                if (hasOtpError) setHasOtpError(false);
              }}
              onCodeFilled={(code) => {
                setOtpCode(code);
              }}
              boxStyle={styles.boxStyle}
            />

            {hasOtpError && (
              <AppText style={styles.errorText} color={colors.destructive}>
                {t('auth.codeMatchError')}
              </AppText>
            )}
          </AppView>

          {/* ── Verify Code Button ── */}
          <AppButton
            size="lg"
            tx="auth.verifyCode"
            onPress={onVerifyCode}
            disabled={otpCode.length < 6 || isAnyLoading}
            loading={isVerifying}
            style={styles.actionBtn}
          />

          {/* ── Resend Code Link with 60s Countdown Timer & Loader ── */}
          <AppTouchableOpacity
            activeOpacity={canResend ? 0.7 : 1}
            disabled={!canResend || isAnyLoading}
            style={styles.resendBtn}
            onPress={handleResendCode}
          >
            {isResending ? (
              <AppView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: screenUtils.scaleWidth(8) }} />
                <AppText style={styles.resendText} color={colors.primary}>
                  {t('common.loading')}
                </AppText>
              </AppView>
            ) : canResend ? (
              <AppText style={styles.resendText} color={colors.primary}>
                {t('auth.resendCode')}
              </AppText>
            ) : (
              <AppText style={styles.resendText} color={colors.textMuted}>
                {t('auth.resendCodeIn', { time: formatTimer(timer) })}
              </AppText>
            )}
          </AppTouchableOpacity>
        </AppView>
      )}

      {/* ── Footer ── */}
      <AuthFooter />
    </BaseContainer>
  );
};
