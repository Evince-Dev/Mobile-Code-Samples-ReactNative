import React from 'react';
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
  GoogleButton,
  AppLoader,
} from '../../components/common';
import { useTheme } from '../../contexts/ThemeContext';
import { useAlert } from '../../contexts/AlertContext';
import { screenUtils } from '../../utils/screenUtils';
import { FONTS } from '../../utils/fontConstants';
import { ChevronRightIcon } from '../../components/icons';
import { useAppDispatch, useLoginMutation } from '../../store';
import { setCredentials } from '../../store/slices/authSlice';
import { StorageService } from '../../services/storageService';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

// Zod Validation Schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'auth.emailRequired' })
    .email({ message: 'auth.invalidEmail' }),
  password: z
    .string()
    .min(1, { message: 'auth.passwordRequired' })
    .min(6, { message: 'auth.passwordMinLength' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showAlert } = useAlert();

  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();

  /**
   * Handles Form Submission
   * Triggers the RTK Query login mutation and handles invalid credentials via AlertContext.
   */
  const onValidSubmit = async (data: LoginFormValues, isGoogle: boolean = false) => {
    try {
      isGoogle ? setIsGoogleLoading(true) : null;
      await loginMutation({ email: data.email, password: data.password }).unwrap();
      navigation.replace('App');
    } catch (error: any) {
      console.log('Login error:', error);
      isGoogle ? setIsGoogleLoading(false) : null;
      const apiErrorMessage =
        error?.data?.message ||
        error?.data?.error ||
        error?.error ||
        error?.message ||
        t('auth.invalidCredentials');

      showAlert({
        title: t('common.error'),
        message: apiErrorMessage,
        type: 'error',
      });
    } finally {
      isGoogle ? setIsGoogleLoading(false) : null;
    }
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

      {/* ── Heading ── */}
      <AppHeadingBlock
        titleTx="auth.welcomeBack"
        subtitleTx="auth.signInSubtitle"
        containerStyle={styles.headingBlock}
      />

      {/* ── Continue with Google ── */}
      <GoogleButton
        onPress={() => {
          onValidSubmit({ email: 'user@example.com', password: 'Password123!' }, true);
        }}
      />

      {/* ── Divider ── */}
      <AppView style={styles.dividerRow}>
        <AppView style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <AppText style={styles.dividerText} color={colors.textMuted}>
          {t('auth.orWithEmail')}
        </AppText>
        <AppView style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </AppView>

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
              returnKeyType="next"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorTx={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormInputField
              labelTx="auth.passwordLabel"
              placeholderTx="auth.passwordPlaceholder"
              secureTextEntry
              showPasswordToggle
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onValidSubmit)}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorTx={errors.password?.message}
            />
          )}
        />
      </AppView>

      {/* ── Sign In Button ── */}
      <AppButton
        size="lg"
        tx="auth.signIn"
        onPress={handleSubmit(onValidSubmit)}
        disabled={!isValid}
        loading={isSubmitting || isLoginLoading}
        style={styles.signInPressable}
      />

      {/* ── Action Links ── */}
      <AppView style={styles.linksBlock}>
        <AppTouchableOpacity
          activeOpacity={0.7}
          style={styles.linkTouch}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <AppText style={styles.forgotText} color={colors.linkPrimary}>
            {t('auth.forgotPassword')}
          </AppText>
        </AppTouchableOpacity>

        <AppTouchableOpacity
          activeOpacity={0.7}
          style={styles.codeRow}
          onPress={() => navigation.navigate('LoginWithCode')}
        >
          <AppText style={styles.codeText} color={colors.textMuted}>
            {t('auth.signInOneTimeCode')}
          </AppText>
          <ChevronRightIcon width={14} height={14} color={colors.textMuted} />
        </AppTouchableOpacity>

        <AppView style={styles.registerRow}>
          <AppText style={styles.registerText} color={colors.textMuted}>
            {t('auth.dontHaveAccount')}{' '}
          </AppText>
          <AppTouchableOpacity activeOpacity={0.7}>
            <AppText style={styles.registerLink} color={colors.linkPrimary}>
              {t('auth.getStarted')}
            </AppText>
          </AppTouchableOpacity>
        </AppView>
      </AppView>

      {/* ── Footer ── */}
      <AuthFooter />

      {/* ── Common Loader ── */}
      <AppLoader visible={isGoogleLoading} message={t('common.loggingIn')} />
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: screenUtils.scaleHeight(8),
    marginBottom: screenUtils.scaleHeight(44),
  },
  byTag: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(11),
    textTransform: 'uppercase',
  },

  // Heading Block
  headingBlock: {
    marginBottom: screenUtils.scaleHeight(28),
  },
  heading: {
    fontSize: screenUtils.scaleFont(24),
    marginBottom: screenUtils.scaleHeight(4),
    fontFamily: FONTS.GEIST_SEMI_BOLD,
  },
  subheading: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(14),
    lineHeight: screenUtils.scaleFont(14) * 1.4,
  },

  // Google Button
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: screenUtils.scaleWidth(10),
    height: screenUtils.scaleHeight(48),
    borderRadius: screenUtils.scaleSize(12),
    borderWidth: 1,
    marginBottom: screenUtils.scaleHeight(20),
  },
  googleBtnText: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(15),
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenUtils.scaleHeight(20),
    gap: screenUtils.scaleWidth(10),
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(12),
    flexShrink: 0,
  },

  // Form
  form: {
    marginBottom: screenUtils.scaleHeight(4),
  },

  // Sign In Button
  signInPressable: {
    marginBottom: screenUtils.scaleHeight(16),
  },

  // Links
  linksBlock: {
    alignItems: 'center',
    gap: screenUtils.scaleHeight(8),
    marginBottom: screenUtils.scaleHeight(32),
  },
  linkTouch: {
    paddingVertical: 4,
  },
  forgotText: {
    fontFamily: FONTS.GEIST_MEDIUM,
    fontSize: screenUtils.scaleFont(14),
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenUtils.scaleWidth(4),
    paddingVertical: 4,
  },
  codeText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(14),
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: 4,
  },
  registerText: {
    fontFamily: FONTS.GEIST_REGULAR,
    fontSize: screenUtils.scaleFont(13),
  },
  registerLink: {
    fontFamily: FONTS.GEIST_SEMI_BOLD,
    fontSize: screenUtils.scaleFont(13),
  },
});
