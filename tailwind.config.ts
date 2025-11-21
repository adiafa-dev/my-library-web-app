import type { Config } from 'tailwindcss';
import plugin, { PluginAPI } from 'tailwindcss/plugin';

type WeightKey = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';

const textSizes = {
  'display-3xl': '--text-display-3xl',
  'display-2xl': '--text-display-2xl',
  'display-xl': '--text-display-xl',
  'display-lg': '--text-display-lg',
  'display-md': '--text-display-md',
  'display-sm': '--text-display-sm',
  'display-xs': '--text-display-xs',
  'text-xl': '--text-xl',
  'text-lg': '--text-lg',
  'text-md': '--text-md',
  'text-sm': '--text-sm',
  'text-xs': '--text-xs',
};

const fontWeights = {
  regular: '--font-weight-regular',
  medium: '--font-weight-medium',
  semibold: '--font-weight-semibold',
  bold: '--font-weight-bold',
  extrabold: '--font-weight-extrabold',
};

const customTextPlugin = plugin(function ({ addUtilities }: PluginAPI) {
  // Sekarang tipe-nya 100% aman, ga pake any!
  const newUtilities = Object.fromEntries(
    Object.entries(textSizes).flatMap(([sizeKey, sizeVar]) =>
      Object.keys(fontWeights).map((weightKey) => {
        const className = `.${sizeKey}-${weightKey}` as const;

        return [
          className,
          {
            fontSize: `var(${sizeVar})`,
            lineHeight: `var(${sizeVar}-line-height)`,
            fontWeight: `var(${fontWeights[weightKey as WeightKey]})`,
          },
        ];
      })
    )
  );

  // addUtilities otomatis support responsive di v4, ga perlu variants: ['responsive']
  addUtilities(newUtilities);
});

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  plugins: [customTextPlugin],
} satisfies Config;
