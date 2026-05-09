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

	uniform float iTime;
	uniform vec2 pos_offset;
	uniform float radius;


	void main(){

		float dist = coord_tex.x * coord_tex.x + coord_tex.y * coord_tex.y;//距离中心距离
		
		if(dist > 1.0)
		{
			discard;
		}

		
		//旋转到球面上的法向量
		float sin_theta = coord_tex.y;
		float cos_theta = sqrt(abs(1.0 - coord_tex.y * coord_tex.y));
		float sin_phi = coord_tex.x;
		float cos_phi = sqrt(abs(1.0 - coord_tex.x * coord_tex.x));
		mat3 rot_theta = mat3(1.0, 0.0, 0.0, 0.0, cos_theta, -sin_theta, 0.0, sin_theta, cos_theta);
		mat3 rot_phi = mat3(cos_phi, 0.0, -sin_phi, 0.0, 1.0, 0.0, sin_phi, 0.0, cos_phi);
		vec3 normal = rot_phi * rot_theta * vec3(0.0, 0.0, 1.0);

		//光线计算
		vec3 position = vec3(pos_offset + coord_tex * radius, radius * sqrt(abs(1.0 - dist)));//tmp

		vec3 viewPos = vec3(0, 0, 2.0);//todo
		
		vec3 lightDir = vec3(0.7071, 0.0 , 0.7071);//光源方向
		//vec3 reflectDir = reflect(-lightDir, normal);
		vec3 viewDir = normalize(viewPos - position);
		vec3 half_vec = normalize(lightDir + viewDir);//计算半程向量
		float mir = pow(max(dot(half_vec, normal), 0.0), 16.0);

		float env = max(dot(lightDir, normal), 0.0);
		float back_env = 0.1;

		vec3 color_tmp = vec3(mir * 0.4 + env * 0.2 + 0.2);

		FragColor = vec4(color_tmp, 1.0);
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

	//uniform float alpha; // 透明度

	void main(){
		// 粒子颜色
		FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
	`;

//AI----------------------------------------------------end

export {vertice_rect_source, fragment_rect_source, vertice_particle_source, fragment_particle_source

};