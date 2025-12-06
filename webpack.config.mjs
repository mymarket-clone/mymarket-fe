export const module = {
  rules: [
    {
      test: /\.scss$/,
      use: [
        {
          loader: 'sass-resources-loader',
          options: {
            resources: ['./src/app/styles/vars.scss', './src/app/styles/mixines.scss'],
          },
        },
      ],
    },
  ],
}
