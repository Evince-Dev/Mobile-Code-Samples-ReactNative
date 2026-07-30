import React from 'react';
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
  GoogleButton,
} from '../../../components/common';
import { useTheme } from '../../../contexts/ThemeContext';
import { screenUtils } from '../../../utils/screenUtils';
import { ChevronRightIcon } from '../../../components/icons';
import { useAppDispatch, useAppSelector, useLoginMutation } from '../../../store';
import { setGoogleLoading } from '../../../store/slices/authSlice';
import { NavigationService, AuthValidationService, LoginFormValues } from '../../../services';
import { styles } from './LoginScreen.styles';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isGoogleLoading = useAppSelector((state) => state.auth.isGoogleLoading);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(AuthValidationService.loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();

  const isAnyLoading = isGoogleLoading || isSubmitting || isLoginLoading;

  /**
   * Handles Form Submission
   */
  const onValidSubmit = (data: LoginFormValues) => {
    loginMutation({ email: data.email, password: data.password });
  };

  /**
   * Handles Google Login Submission
   */
  const handleGoogleSubmit = () => {
    dispatch(setGoogleLoading(true));
    loginMutation({ email: 'user@example.com', password: 'Password123!' });
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

      {/* ── Heading ── */}
      <AppHeadingBlock
        titleTx="auth.welcomeBack"
        subtitleTx="auth.signInSubtitle"
        containerStyle={styles.headingBlock}
      />

      {/* ── Continue with Google ── */}
      <GoogleButton
        onPress={handleGoogleSubmit}
        disabled={isAnyLoading}
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
              editable={!isAnyLoading}
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
              editable={!isAnyLoading}
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
        disabled={!isValid || isAnyLoading}
        loading={!isGoogleLoading && isAnyLoading}
        style={styles.signInPressable}
      />

      {/* ── Action Links ── */}
      <AppView style={styles.linksBlock}>
        <AppTouchableOpacity
          activeOpacity={0.7}
          disabled={isAnyLoading}
          style={styles.linkTouch}
          onPress={() => NavigationService.navigate('ForgotPassword')}
        >
          <AppText style={styles.forgotText} color={colors.linkPrimary}>
            {t('auth.forgotPassword')}
          </AppText>
        </AppTouchableOpacity>

        <AppTouchableOpacity
          activeOpacity={0.7}
          disabled={isAnyLoading}
          style={styles.codeRow}
          onPress={() => NavigationService.navigate('LoginWithCode')}
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
          <AppTouchableOpacity activeOpacity={0.7} disabled={isAnyLoading}>
            <AppText style={styles.registerLink} color={colors.linkPrimary}>
              {t('auth.getStarted')}
            </AppText>
          </AppTouchableOpacity>
        </AppView>
      </AppView>

      {/* ── Footer ── */}
      <AuthFooter />
    </BaseContainer>
  );
};
