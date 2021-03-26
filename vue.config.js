// vue.config.js
module.exports = {
	/*devServer: {
		proxy: "http://localhost:3002"
    }*/
  publicPath: process.env.NODE_ENV === 'production'
    ? '/leaf/'
    : '/leaf/',
  configureWebpack: {
  	output: {
	    filename: '[name].[hash].bundle.js'
  	}
  }

}
