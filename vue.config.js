// vue.config.js
module.exports = {
	/*devServer: {
		proxy: "http://localhost:3002"
    }*/
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vis/'
    : '/vis/',
  configureWebpack: {
  	output: {
	    filename: '[name].[hash].bundle.js'
  	}
  }

}
