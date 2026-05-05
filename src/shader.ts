//着色器代码


//默认缓冲用于渲染圆形的着色器
const vertice_rect_source: string = `#version 300 es
	precision mediump float;
	in vec2 aPos;//坐标
	out vec2 coord_tex;

	uniform vec2 pos_offset;
	uniform float radius;
	uniform float scale;
	uniform float len_hei_ratio;

	void main(){
		vec2 pos_global = (aPos * radius  + pos_offset) * scale;
		gl_Position = vec4(pos_global.x * len_hei_ratio, pos_global.y, 1.0, 1.0);
		coord_tex = aPos;
	}
	`;
const fragment_rect_source: string = `#version 300 es
	precision mediump float;
	in vec2 coord_tex;
	out vec4 FragColor;

	//uniform sampler2D Tex_hdr;
	//uniform sampler2D Tex_blur;
	void main(){

		float dist = coord_tex.x * coord_tex.x + coord_tex.y * coord_tex.y;//距离中心距离
		if(dist > 1.0)
		{
			discard;
		}

		FragColor =  vec4(vec3(0.5), 1.0);
	}
	`;

//AI----------------------------------------------------
// 粒子顶点着色器
const vertice_particle_source: string = `#version 300 es
	precision mediump float;
	in vec2 aPos;//坐标
	
	uniform vec2 pos_offset;
	uniform float scale;
	uniform float len_hei_ratio;
	uniform float size;

	void main(){
		// 计算粒子的世界位置
		vec2 pos_global = aPos * size + pos_offset;
		// 应用缩放和宽高比
		gl_Position = vec4(pos_global.x * len_hei_ratio * scale, pos_global.y * scale, 0.0, 1.0);
	}
	`;

// 粒子片段着色器
const fragment_particle_source: string = `#version 300 es
	precision mediump float;
	out vec4 FragColor;

	uniform float alpha; // 透明度

	void main(){
		// 粒子颜色，使用半透明的橙色/黄色表示推进器火焰
		FragColor = vec4(1.0, 0.7, 0.3, alpha * 0.8);
	}
	`;

//AI----------------------------------------------------end

export {vertice_rect_source, fragment_rect_source, vertice_particle_source, fragment_particle_source

};