import React, { useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { RootStackParamList } from '../../navigation/types';
import {
  BaseContainer,
  AppText,
  AppButton,
  AppView,
  AppTouchableOpacity,
  AppHeadingBlock,
} from '../../components/base';
import {
  FormInputField,
  AuthTopBar,
  AuthFooter,
  OTPInput,
  OTPInputRef,
  BackButton,
} from '../../components/common';
import { useTheme } from '../../contexts/ThemeContext';
import { screenUtils } from '../../utils/screenUtils';
import { FONTS } from '../../utils/fontConstants';
import { MailIcon } from '../../components/icons';
import { useAppDispatch } from '../../store';
import { setCredentials } from '../../store/slices/authSlice';

type Props = StackScreenProps<RootStackParamList, 'LoginWithCode'>;

const codeFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'auth.emailRequired' })
    .email({ message: 'auth.invalidEmail' }),
});

type CodeFormValues = z.infer<typeof codeFormSchema>;

export const LoginWithCodeScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasOtpError, setHasOtpError] = useState(false);

  const otpRef = useRef<OTPInputRef>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CodeFormValues>({
    resolver: zodResolver(codeFormSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

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
    dispatch(
      setCredentials({
        user: {
          id: 'usr_101',
          name: submittedEmail.split('@')[0],
          email: submittedEmail,
        },
      })
    );
    navigation.replace('App');
  };

  const handleResendCode = () => {
    otpRef.current?.clear();
    setHasOtpError(false);
    setOtpCode('');
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
      <BackButton
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
            disabled={!isValid}
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
            disabled={otpCode.length < 6}
            loading={isVerifying}
            style={styles.actionBtn}
          />

          {/* ── Resend Code Link ── */}
          <AppTouchableOpacity
            activeOpacity={0.7}
            style={styles.resendBtn}
            onPress={handleResendCode}
          >
            <AppText style={styles.resendText} color={colors.textMuted}>
              {t('auth.resendCode')}
            </AppText>
          </AppTouchableOpacity>
        </AppView>
      )}

      {/* ── Footer ── */}
      <AuthFooter />
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenUtils.scaleWidth(6),
    marginBottom: screenUtils.scaleHeight(36),
    paddingVertical: 4,
  },
  backText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(14),
  },

  contentBlock: {
    width: '100%',
  },
  boxStyle: {
    marginHorizontal: screenUtils.scaleWidth(6)
  },
  mailIconContainer: {
    width: screenUtils.scaleSize(48),
    height: screenUtils.scaleSize(48),
    borderRadius: screenUtils.scaleSize(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenUtils.scaleHeight(16),
  },

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
  emailText: {
    fontFamily: FONTS.GEIST_MEDIUM,
  },

  form: {
    marginBottom: screenUtils.scaleHeight(8),
  },

  otpWrapper: {
    marginBottom: screenUtils.scaleHeight(24),
  },
  errorText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(13),
    textAlign: 'center',
    marginTop: screenUtils.scaleHeight(12),
  },

  actionBtn: {
    marginTop: screenUtils.scaleHeight(8),
  },

  resendBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenUtils.scaleHeight(16),
    marginTop: screenUtils.scaleHeight(8),
  },
  resendText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(14),
  },
});
