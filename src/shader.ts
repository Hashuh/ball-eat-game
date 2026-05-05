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



export {vertice_rect_source, fragment_rect_source, 

};