/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shader.ts"
/*!***********************!*\
  !*** ./src/shader.ts ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fragment_particle_source: () => (/* binding */ fragment_particle_source),
/* harmony export */   fragment_rect_source: () => (/* binding */ fragment_rect_source),
/* harmony export */   vertice_particle_source: () => (/* binding */ vertice_particle_source),
/* harmony export */   vertice_rect_source: () => (/* binding */ vertice_rect_source)
/* harmony export */ });
//着色器代码
//默认缓冲用于渲染圆形的着色器
const vertice_rect_source = `#version 300 es
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
const fragment_rect_source = `#version 300 es
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
const vertice_particle_source = `#version 300 es
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
const fragment_particle_source = `#version 300 es
	precision mediump float;
	out vec4 FragColor;

	//uniform float alpha; // 透明度

	void main(){
		// 粒子颜色，使用半透明的橙色/黄色表示推进器火焰
		FragColor = vec4(1.0, 0.7, 0.3, 1.0);
	}
	`;
//AI----------------------------------------------------end



/***/ },

/***/ "./src/shader_class.ts"
/*!*****************************!*\
  !*** ./src/shader_class.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   shader: () => (/* binding */ shader)
/* harmony export */ });
class shader {
    //  初始化着色器程序，让 WebGL 知道如何绘制我们的数据
    constructor(gl, vsSource, fsSource) {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        // 创建着色器程序
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        // 如果创建失败，alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program: " +
                gl.getProgramInfoLog(shaderProgram));
            this.shaderProgram = null;
        }
        else {
            this.shaderProgram = shaderProgram;
        }
    }
    loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        // Send the source to the shader object
        gl.shaderSource(shader, source);
        // Compile the shader program
        gl.compileShader(shader);
        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
}



/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/stareat.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shader_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shader_class */ "./src/shader_class.ts");
/* harmony import */ var _shader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shader */ "./src/shader.ts");


// FIFO队列实现，用于管理粒子生命周期
// class FifoQueue<T> {
//     items: T[];
//     constructor() {
//         this.items = [];
//     }
//     enqueue(element: T): void {
//         this.items.push(element);
//     }
//     dequeue(): T | undefined {
//         return this.items.shift();
//     }
//     front(): T | undefined {
//         return this.items.length > 0 ? this.items[0] : undefined;
//     }
//     isEmpty(): boolean {
//         return this.items.length === 0;
//     }
//     size(): number {
//         return this.items.length;
//     }
//     clear(): void {
//         this.items = [];
//     }
// }
function find_min_dist(star_array, pos_x, pos_y) {
    let min_dist = 1.0;
    for (let i = 0; i < star_array.length; i++) {
        const dist_x = pos_x - star_array[i].pos_x;
        const dist_y = pos_y - star_array[i].pos_y;
        const point_dist = Math.sqrt(dist_x * dist_x + dist_y * dist_y);
        const cur_dist = point_dist - star_array[i].radius;
        min_dist = min_dist < cur_dist ? min_dist : cur_dist;
    }
    return min_dist;
}
//function normalize(x:number, y:number):
function vec_mul(v1, v2) {
    return v1[0] * v2[1] - v1[1] * v2[0];
}
function main() {
    window.addEventListener("keydown", handle_keydown);
    window.addEventListener("keyup", handle_keyup);
    //像素大小初始化
    let screen_width = window.innerWidth;
    let screen_height = window.innerHeight;
    const canvas = document.querySelector("#glcanvas");
    if (canvas) {
        canvas.width = screen_width;
        canvas.height = screen_height;
    }
    //const canvas = document.querySelector("#glcanvas") as HTMLCanvasElement;
    if (!canvas) {
        return;
    }
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("无法初始化 WebGL2，你的浏览器、操作系统或硬件等可能不支持 WebGL2。");
        return;
    }
    gl.viewport(0, 0, screen_width, screen_height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.enable(gl.DEPTH_TEST); //启用 深度检测
    //gl.depthFunc(gl.LEQUAL); //深度缓冲值 小于等于时 绘制像素
    //编译着色器
    const shaderProgram_rect = new _shader_class__WEBPACK_IMPORTED_MODULE_0__.shader(gl, _shader__WEBPACK_IMPORTED_MODULE_1__.vertice_rect_source, _shader__WEBPACK_IMPORTED_MODULE_1__.fragment_rect_source);
    const shaderProgram_particle = new _shader_class__WEBPACK_IMPORTED_MODULE_0__.shader(gl, _shader__WEBPACK_IMPORTED_MODULE_1__.vertice_particle_source, _shader__WEBPACK_IMPORTED_MODULE_1__.fragment_particle_source);
    //rect顶点属性
    const programInfo_rect = {
        program: shaderProgram_rect.shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram_rect.shaderProgram, "aPos"),
        },
        uniformLocations: {
            pos_offset: gl.getUniformLocation(shaderProgram_rect.shaderProgram, "pos_offset"),
            scale: gl.getUniformLocation(shaderProgram_rect.shaderProgram, "scale"),
            radius: gl.getUniformLocation(shaderProgram_rect.shaderProgram, "radius"),
            len_hei_ratio: gl.getUniformLocation(shaderProgram_rect.shaderProgram, "len_hei_ratio"),
        },
    };
    //particle顶点属性
    const programInfo_particle = {
        program: shaderProgram_particle.shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram_particle.shaderProgram, "aPos"),
        },
        uniformLocations: {
            pos_offset: gl.getUniformLocation(shaderProgram_particle.shaderProgram, "pos_offset"),
            scale: gl.getUniformLocation(shaderProgram_particle.shaderProgram, "scale"),
            len_hei_ratio: gl.getUniformLocation(shaderProgram_particle.shaderProgram, "len_hei_ratio"),
            size: gl.getUniformLocation(shaderProgram_particle.shaderProgram, "size"),
            //alpha: gl.getUniformLocation(shaderProgram_particle.shaderProgram, "alpha"),
        },
    };
    //顶点数据
    const VAO_rect = gl.createVertexArray();
    gl.bindVertexArray(VAO_rect);
    const VBO_rect = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO_rect);
    {
        const rect = [
            -1, -1,
            -1, 1,
            1, 1,
            1, -1,
        ]; //顶点数据
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rect), gl.STATIC_DRAW);
        gl.vertexAttribPointer(programInfo_rect.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo_rect.attribLocations.vertexPosition);
    }
    const EBO_rect = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO_rect);
    {
        const rect_indices = [0, 2, 1, 0, 3, 2];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(rect_indices), gl.STATIC_DRAW);
    }
    // 粒子顶点数据 (小矩形)
    const VAO_particle = gl.createVertexArray();
    gl.bindVertexArray(VAO_particle);
    const VBO_particle = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO_particle);
    {
        const particle_vertices = [
            -0.5, -0.5, // 左下角
            0.5, -0.5, // 右下角
            0.5, 0.5, // 右上角
            -0.5, 0.5, // 左上角
        ]; // 顶点数据
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particle_vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(programInfo_particle.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(programInfo_particle.attribLocations.vertexPosition);
    }
    const EBO_particle = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO_particle);
    {
        const particle_indices = [0, 1, 2, 0, 2, 3]; // 两个三角形组成矩形
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(particle_indices), gl.STATIC_DRAW);
    }
    //param
    const max_init_radius = 0.3;
    const min_init_radius = 0.02;
    const init_num_star = 80;
    const min_span = 0.005; //生成的两个圆表面的最小间隔
    //
    let star_array = new Array();
    //let num_star:number = init_num_star;
    //init
    for (let i = 0; i < init_num_star; i++) {
        //todo
        if (i == 0) {
            star_array.push({
                radius: 0.02,
                pos_x: 0.0,
                pos_y: 0.0,
                velo_x: 0.0,
                velo_y: 0.0,
                if_exist: true
            });
        }
        else {
            while (true) {
                //random gen
                const rand_pos_x = (Math.random() * 2.0 - 1.0) * 0.5;
                const rand_pos_y = (Math.random() * 2.0 - 1.0) * 0.5;
                const min_dist = find_min_dist(star_array, rand_pos_x, rand_pos_y);
                if (min_dist - min_span >= min_init_radius) {
                    //radius:Math.min(Math.random() * (min_dist - min_init_radius) + min_init_radius , max_init_radius),
                    star_array.push({
                        radius: Math.min(Math.random() * (min_dist - min_span - min_init_radius) + min_init_radius, max_init_radius),
                        pos_x: rand_pos_x,
                        pos_y: rand_pos_y,
                        velo_x: 0.0,
                        velo_y: 0.0,
                        if_exist: true
                    });
                    break;
                }
            }
        }
    }
    //粒子数组
    let particle_Array = new Array();
    //渲染循环
    let then = 0.0;
    let last_cam_scale = 0.0;
    function render(now) {
        if (!gl) {
            return;
        }
        now *= 0.001; // convert to seconds
        if (then == 0.0) {
            then = now;
        }
        const deltaTime = now - then;
        then = now;
        //大小变化计算
        let num_star = star_array.length;
        for (let i = 0; i < num_star; i++) {
            if (star_array[i].if_exist)
                for (let j = i + 1; j < num_star; j++) {
                    if (star_array[j].if_exist) {
                        const dist_x = star_array[i].pos_x - star_array[j].pos_x;
                        const dist_y = star_array[i].pos_y - star_array[j].pos_y;
                        const distance_2 = dist_x * dist_x + dist_y * dist_y;
                        const distance = Math.sqrt(distance_2);
                        //解方程计算 保持两者总面积不变
                        if (star_array[i].radius + star_array[j].radius > distance) {
                            const total_vol = star_array[i].radius * star_array[i].radius +
                                star_array[j].radius * star_array[j].radius;
                            const in_sqrt = 8.0 * total_vol - 4.0 * distance_2;
                            let result_sqrt = 0.0;
                            if (in_sqrt > 0) {
                                result_sqrt = Math.sqrt(in_sqrt);
                            }
                            //解方程结果
                            const radius_larger = (2.0 * distance + result_sqrt) / 4.0;
                            let index_radius_larger = i;
                            let index_radius_smaller = j;
                            if (star_array[i].radius < star_array[j].radius) {
                                index_radius_larger = j;
                                index_radius_smaller = i;
                            }
                            //判断是否完全吞并
                            if (radius_larger >= distance) {
                                star_array[index_radius_larger].radius = Math.sqrt(total_vol);
                                star_array[index_radius_smaller].if_exist = false;
                            }
                            else {
                                star_array[index_radius_larger].radius = radius_larger;
                                star_array[index_radius_smaller].radius = distance - radius_larger;
                            }
                        }
                    }
                }
        }
        //判断是否存活
        if (star_array[0].if_exist == false) {
            //todo
        }
        //按键控制移动
        let move_direction_x = 0.0; //控制运动方向
        let move_direction_y = 0.0;
        const move_speed = 0.1;
        if (w_down == 1)
            move_direction_y += 1.0;
        if (s_down == 1)
            move_direction_y -= 1.0;
        if (a_down == 1)
            move_direction_x -= 1.0;
        if (d_down == 1)
            move_direction_x += 1.0;
        //normalize
        if (move_direction_x != 0.0 || move_direction_y != 0.0) {
            const move_direction_len = Math.sqrt(move_direction_y * move_direction_y +
                move_direction_x * move_direction_x);
            move_direction_x /= move_direction_len;
            move_direction_y /= move_direction_len;
        }
        //运动方向更新
        star_array[0].velo_x += move_direction_x * move_speed * deltaTime;
        star_array[0].velo_y += move_direction_y * move_speed * deltaTime;
        //粒子添加
        const particle_life = 0.5;
        const dist_apply_factor = 2.0; //喷气的作用范围系数 作用范围数倍于当前半径 
        if (move_direction_x != 0.0 || move_direction_y != 0.0) {
            const particle_threshold = 0.8;
            const particle_split = 0.1; //粒子散射系数
            const particle_speed = star_array[0].radius * dist_apply_factor / particle_life;
            if (Math.random() > particle_threshold) {
                particle_Array.push({
                    pos_x: star_array[0].pos_x,
                    pos_y: star_array[0].pos_y,
                    velo_x: (-move_direction_x + Math.random() * particle_split) * particle_speed, //速度
                    velo_y: (-move_direction_y + Math.random() * particle_split) * particle_speed,
                    life: 0.0, // 生命值（0.0-1.0）大于0时移除
                    size: star_array[0].radius * 0.1
                });
            }
            //喷气作用交互
            for (let i = 0; i < num_star; i++) {
                if (star_array[i].if_exist) {
                    const dest_x = star_array[i].pos_x - star_array[0].pos_x; //到目标的向量
                    const dest_y = star_array[i].pos_y - star_array[0].pos_y;
                    const dist_point_line = Math.abs(move_direction_x * (dest_y) -
                        move_direction_y * (dest_x)); //叉乘 圆心与直线距离
                    const dot_dir = -move_direction_x * dest_x -
                        move_direction_y * dest_y; //判断方向是否相同
                    const dist_dest = Math.sqrt(dest_x * dest_x + dest_y * dest_y); //到目标距离
                    if (dist_point_line < star_array[i].radius &&
                        dot_dir > 0 &&
                        dist_dest - star_array[i].radius < dist_apply_factor * star_array[0].radius) {
                        //根据质量作用喷气效果
                        const rho = 1000000.0; //密度
                        const mass = star_array[i].radius * star_array[i].radius * rho;
                        star_array[i].velo_x -= move_direction_x / mass * deltaTime;
                        star_array[i].velo_y -= move_direction_y / mass * deltaTime;
                    }
                }
            }
        }
        const max_scale = 100.0;
        //相机位置
        const cam_pos_x = star_array[0].pos_x;
        const cam_pos_y = star_array[0].pos_y;
        //相机放大倍数
        const alpha = 0.01; //滤波器系数
        const cam_scale = Math.min((0.3 * 1.0 / star_array[0].radius) * alpha +
            last_cam_scale * (1.0 - alpha), max_scale);
        //const cam_scale:number = 3.0;
        last_cam_scale = cam_scale;
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(programInfo_rect.program);
        gl.bindVertexArray(VAO_rect);
        //速度更新和渲染
        for (let i = 0; i < num_star; i++) {
            if (star_array[i].if_exist) {
                star_array[i].pos_x += star_array[i].velo_x * deltaTime;
                star_array[i].pos_y += star_array[i].velo_y * deltaTime;
                //render
                gl.uniform2f(programInfo_rect.uniformLocations.pos_offset, star_array[i].pos_x - cam_pos_x, star_array[i].pos_y - cam_pos_y);
                gl.uniform1f(programInfo_rect.uniformLocations.len_hei_ratio, 1.0 * screen_height / screen_width);
                gl.uniform1f(programInfo_rect.uniformLocations.scale, cam_scale);
                gl.uniform1f(programInfo_rect.uniformLocations.radius, star_array[i].radius);
                gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            }
        }
        //粒子渲染
        gl.useProgram(programInfo_particle.program);
        gl.bindVertexArray(VAO_particle);
        //粒子渲染
        for (let i_particle = 0; i_particle < particle_Array.length; i_particle++) {
            const particle = particle_Array[i_particle];
            // 计算粒子相对于相机的位置
            const particleOffsetX = particle.pos_x - cam_pos_x + particle.velo_x * particle.life;
            const particleOffsetY = particle.pos_y - cam_pos_y + particle.velo_y * particle.life;
            // 设置粒子的统一变量
            gl.uniform2f(programInfo_particle.uniformLocations.pos_offset, particleOffsetX, particleOffsetY);
            gl.uniform1f(programInfo_particle.uniformLocations.len_hei_ratio, 1.0 * screen_height / screen_width);
            gl.uniform1f(programInfo_particle.uniformLocations.scale, cam_scale);
            gl.uniform1f(programInfo_particle.uniformLocations.size, particle.size);
            //gl.uniform1f(programInfo_particle.uniformLocations.alpha, particle.life); // 使用生命值作为透明度
            // 绘制粒子
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            //粒子生命更新
            particle_Array[i_particle].life += deltaTime;
        }
        //移除过期粒子
        while (particle_Array[0] != undefined) {
            if (particle_Array[0].life > particle_life) {
                particle_Array.shift();
            }
            else {
                break;
            }
        }
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
let w_down = 0;
let s_down = 0;
let a_down = 0;
let d_down = 0;
function handle_keydown(event) {
    switch (event.code) {
        case "KeyW":
            w_down = 1;
            break;
        case "KeyS":
            s_down = 1;
            break;
        case "KeyA":
            a_down = 1;
            break;
        case "KeyD":
            d_down = 1;
            break;
    }
}
function handle_keyup(event) {
    switch (event.code) {
        case "KeyW":
            w_down = 0;
            break;
        case "KeyS":
            s_down = 0;
            break;
        case "KeyA":
            a_down = 0;
            break;
        case "KeyD":
            d_down = 0;
            break;
    }
}
//事件监听
document.addEventListener("DOMContentLoaded", main);

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map