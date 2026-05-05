class shader {
	shaderProgram: any;

	//  初始化着色器程序，让 WebGL 知道如何绘制我们的数据

	constructor(gl: any, vsSource: string, fsSource: string) {
		const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
		const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

		// 创建着色器程序

		const shaderProgram: any = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		// 如果创建失败，alert
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert(
				"Unable to initialize the shader program: " +
				gl.getProgramInfoLog(shaderProgram),
			);

			this.shaderProgram = null;
		}
		else {
			this.shaderProgram = shaderProgram;
		}


	}

	loadShader(gl: any, type: any, source: string): any {
		const shader = gl.createShader(type);

		// Send the source to the shader object

		gl.shaderSource(shader, source);

		// Compile the shader program

		gl.compileShader(shader);

		// See if it compiled successfully

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert(
				"An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader),
			);
			gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

}

export { shader };