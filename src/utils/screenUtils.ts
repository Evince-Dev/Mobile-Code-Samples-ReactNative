/**
 * Screen Utility Class
 * Provides screen dimensions and responsive scaling based on Figma design
 */

import { Dimensions, PixelRatio } from 'react-native';


// Figma design dimensions
const DESIGN_WIDTH = 440;
const DESIGN_HEIGHT = 956; //932;

class ScreenUtils {
  private static instance: ScreenUtils;
  private screenWidth: number;
  private screenHeight: number;
  private scale: number;
  private fontScale: number;

  private constructor() {
    const { width, height } = Dimensions.get('window');
    this.screenWidth = width;
    this.screenHeight = height;
    this.scale = width / DESIGN_WIDTH;
    this.fontScale = PixelRatio.getFontScale();
  }

  public static getInstance(): ScreenUtils {
    if (!ScreenUtils.instance) {
      ScreenUtils.instance = new ScreenUtils();
    }
    return ScreenUtils.instance;
  }

  /**
   * Get current screen width
   */
  public getWidth(): number {
    return this.screenWidth;
  }

  /**
   * Get current screen height
   */
  public getHeight(): number {
    return this.screenHeight;
  }

  /**
   * Get Figma design width
   */
  public getDesignWidth(): number {
    return DESIGN_WIDTH;
  }

  /**
   * Get Figma design height
   */
  public getDesignHeight(): number {
    return DESIGN_HEIGHT;
  }

  /**
   * Scale width based on Figma design
   * @param width - Width from Figma design
   * @returns Scaled width for current device
   */
  public scaleWidth(width: number): number {
    return width * this.scale;
  }

  /**
   * Scale height based on Figma design
   * @param height - Height from Figma design
   * @returns Scaled height for current device
   */
  public scaleHeight(height: number): number {
    const heightScale = this.screenHeight / DESIGN_HEIGHT;
    return height * heightScale;
  }

  /**
   * Scale font size based on Figma design
   * @param fontSize - Font size from Figma design
   * @returns Scaled font size for current device
   */
  public scaleFont(fontSize: number): number {
    return fontSize * this.scale;
  }

  /**
   * Scale size (works for both width and height)
   * @param size - Size from Figma design
   * @returns Scaled size for current device
   */
  public scaleSize(size: number): number {
    return size * this.scale;
  }

  /**
   * Get responsive width percentage
   * @param percentage - Percentage of screen width (0-100)
   * @returns Width in pixels
   */
  public widthPercentage(percentage: number): number {
    return (this.screenWidth * percentage) / 100;
  }

  /**
   * Get responsive height percentage
   * @param percentage - Percentage of screen height (0-100)
   * @returns Height in pixels
   */
  public heightPercentage(percentage: number): number {
    return (this.screenHeight * percentage) / 100;
  }

  /**
   * Check if device is small screen
   */
  public isSmallScreen(): boolean {
    return this.screenWidth < 375;
  }

  /**
   * Get pixel ratio
   */
  public getPixelRatio(): number {
    return PixelRatio.get();
  }

  /**
   * Update dimensions (call when screen orientation changes)
   */
  public updateDimensions(): void {
    const { width, height } = Dimensions.get('window');
    this.screenWidth = width;
    this.screenHeight = height;
    this.scale = width / DESIGN_WIDTH;
  }
}

// Export singleton instance
export const screenUtils = ScreenUtils.getInstance();

// Export class for testing
export default ScreenUtils;
