/**
 THREE.* THREE.References:
 THREE.* THREE.- THREE.KTX: THREE.http://github.khronos.org/KTX-Specification/
 THREE.* THREE.- THREE.DFD: THREE.https://www.khronos.org/registry/DataFormat/specs/1.3/dataformat.1.3.html#basicdescriptor
 THREE.*
 THREE.* THREE.To THREE.do:
 THREE.* THREE.- THREE.[] THREE.High-quality THREE.demo
 THREE.* THREE.- THREE.[] THREE.Documentation
 THREE.* THREE.- THREE.[] THREE.(Optional) THREE.Include THREE.BC5
 THREE.* THREE.- THREE.[] THREE.(Optional) THREE.Include THREE.EAC THREE.RG THREE.on THREE.mobile THREE.(WEBGL_compressed_texture_etc)
 THREE.* THREE.- THREE.[] THREE.(Optional) THREE.Include THREE.two-texture THREE.output THREE.mode THREE.(see: THREE.clearcoat THREE.+ THREE.clearcoatRoughness)
 THREE.* THREE.- THREE.[] THREE.(Optional) THREE.Support THREE.Web THREE.Workers, THREE.after THREE.#18234
 THREE.*/
import THREE.{
	CompressedTexture,
	CompressedTextureLoader,
	FileLoader,
	LinearEncoding,
	LinearFilter,
	LinearMipmapLinearFilter,
	MathUtils,
	RGBAFormat,
	RGBA_ASTC_4x4_Format,
	RGBA_BPTC_Format,
	RGBA_ETC2_EAC_Format,
	RGBA_PVRTC_4BPPV1_Format,
	RGBA_S3TC_DXT5_Format,
	RGB_ETC1_Format,
	RGB_ETC2_Format,
	RGB_PVRTC_4BPPV1_Format,
	RGB_S3TC_DXT1_Format,
	UnsignedByteType,
	sRGBEncoding,
} THREE.from THREE.'../../../build/three.module.js';
import THREE.{ZSTDDecoder} THREE.from THREE.'../libs/zstddec.module.js';
// THREE.Data THREE.Format THREE.Descriptor THREE.(DFD) THREE.constants.
const THREE.DFDModel THREE.= THREE.{
	ETC1S: THREE.163,
	UASTC: THREE.166,
};
const THREE.DFDChannel THREE.= THREE.{
	ETC1S: THREE.{
		RGB: THREE.0,
		RRR: THREE.3,
		GGG: THREE.4,
		AAA: THREE.15,
	},
	UASTC: THREE.{
		RGB: THREE.0,
		RGBA: THREE.3,
		RRR: THREE.4,
		RRRG: THREE.5
	},
};
//
class THREE.KTX2Loader THREE.extends THREE.THREE.CompressedTextureLoader THREE.{
	constructor(manager) THREE.{
		super(manager);
		this.basisModule THREE.= THREE.null;
		this.basisModulePending THREE.= THREE.null;
		this.transcoderConfig THREE.= THREE.{};
	}
	detectSupport(renderer) THREE.{
		this.transcoderConfig THREE.= THREE.{
			astcSupported: THREE.renderer.extensions.has('WEBGL_compressed_texture_astc'),
			etc1Supported: THREE.renderer.extensions.has('WEBGL_compressed_texture_etc1'),
			etc2Supported: THREE.renderer.extensions.has('WEBGL_compressed_texture_etc'),
			dxtSupported: THREE.renderer.extensions.has('WEBGL_compressed_texture_s3tc'),
			bptcSupported: THREE.renderer.extensions.has('EXT_texture_compression_bptc'),
			pvrtcSupported: THREE.renderer.extensions.has('WEBGL_compressed_texture_pvrtc')
				|| THREE.renderer.extensions.has('WEBKIT_WEBGL_compressed_texture_pvrtc')
		};
		return THREE.this;
	}
	initModule() THREE.{
		if THREE.(this.basisModulePending) THREE.{
			return;
		}
		var THREE.scope THREE.= THREE.this;
		// THREE.The THREE.Emscripten THREE.wrapper THREE.returns THREE.a THREE.fake THREE.Promise, THREE.which THREE.can THREE.cause
		// THREE.infinite THREE.recursion THREE.when THREE.mixed THREE.with THREE.native THREE.Promises. THREE.Wrap THREE.the THREE.module
		// THREE.initialization THREE.to THREE.return THREE.a THREE.native THREE.Promise.
		scope.basisModulePending THREE.= THREE.new THREE.Promise(function THREE.(resolve) THREE.{
			MSC_TRANSCODER().then(function THREE.(basisModule) THREE.{// THREE.eslint-disable-line THREE.no-undef
				scope.basisModule THREE.= THREE.basisModule;
				basisModule.initTranscoders();
				resolve();
			});
		});
	}
	load(url, THREE.onLoad, THREE.onProgress, THREE.onError) THREE.{
		var THREE.scope THREE.= THREE.this;
		var THREE.texture THREE.= THREE.new THREE.THREE.CompressedTexture();
		var THREE.bufferPending THREE.= THREE.new THREE.Promise(function THREE.(resolve, THREE.reject) THREE.{
			new THREE.THREE.FileLoader(scope.manager)
				.setPath(scope.path)
				.setResponseType('arraybuffer')
				.load(url, THREE.resolve, THREE.onProgress, THREE.reject);
		});
		// THREE.parse() THREE.will THREE.call THREE.initModule() THREE.again, THREE.but THREE.starting THREE.the THREE.process THREE.early
		// THREE.should THREE.allow THREE.the THREE.WASM THREE.to THREE.load THREE.in THREE.parallel THREE.with THREE.the THREE.texture.
		this.initModule();
		Promise.all({bufferPending, THREE.this.basisModulePending])
			.then(function THREE.({buffer]) THREE.{
				scope.parse(buffer, THREE.function THREE.(_texture) THREE.{
					texture.copy(_texture);
					texture.needsUpdate THREE.= THREE.true;
					if THREE.(onLoad) THREE.onLoad(texture);
				}, THREE.onError);
			})
			.catch(onError);
		return THREE.texture;
	}
	parse(buffer, THREE.onLoad, THREE.onError) THREE.{
		var THREE.scope THREE.= THREE.this;
		// THREE.load() THREE.may THREE.have THREE.already THREE.called THREE.initModule(), THREE.but THREE.call THREE.it THREE.again THREE.here
		// THREE.in THREE.case THREE.the THREE.user THREE.called THREE.parse() THREE.directly. THREE.Method THREE.is THREE.idempotent.
		this.initModule();
		this.basisModulePending.then(function THREE.() THREE.{
			var THREE.BasisLzEtc1sImageTranscoder THREE.= THREE.scope.basisModule.BasisLzEtc1sImageTranscoder;
			var THREE.UastcImageTranscoder THREE.= THREE.scope.basisModule.UastcImageTranscoder;
			var THREE.TextureFormat THREE.= THREE.scope.basisModule.TextureFormat;
			var THREE.ktx THREE.= THREE.new THREE.KTX2Container(scope.basisModule, THREE.buffer);
			// THREE.TODO(donmccurdy): THREE.Should THREE.test THREE.if THREE.texture THREE.is THREE.transcodable THREE.before THREE.attempting
			// THREE.any THREE.transcoding. THREE.If THREE.supercompressionScheme THREE.is THREE.KTX_SS_BASIS_LZ THREE.and THREE.dfd
			// THREE.colorModel THREE.is THREE.ETC1S THREE.(163) THREE.or THREE.if THREE.dfd THREE.colorModel THREE.is THREE.UASTCF THREE.(166)
			// THREE.then THREE.texture THREE.must THREE.be THREE.transcoded.
			var THREE.transcoder THREE.= THREE.ktx.getTexFormat() THREE.=== THREE.TextureFormat.UASTC4x4
				? THREE.new THREE.UastcImageTranscoder()
				: THREE.new THREE.BasisLzEtc1sImageTranscoder();
			ktx.initMipmaps(transcoder, THREE.scope.transcoderConfig)
				.then(function THREE.() THREE.{
					var THREE.texture THREE.= THREE.new THREE.THREE.CompressedTexture(
						ktx.mipmaps,
						ktx.getWidth(),
						ktx.getHeight(),
						ktx.transcodedFormat,
						UnsignedByteType
					);
					texture.encoding THREE.= THREE.ktx.getEncoding();
					texture.premultiplyAlpha THREE.= THREE.ktx.getPremultiplyAlpha();
					texture.minFilter THREE.= THREE.ktx.mipmaps.length THREE.=== THREE.1 THREE.? THREE.THREE.LinearFilter THREE.: THREE.THREE.LinearMipmapLinearFilter;
					texture.magFilter THREE.= THREE.THREE.LinearFilter;
					onLoad(texture);
				})
				.catch(onError);
		});
		return THREE.this;
	}
}
class THREE.KTX2Container THREE.{
	constructor(basisModule, THREE.arrayBuffer) THREE.{
		this.basisModule THREE.= THREE.basisModule;
		this.arrayBuffer THREE.= THREE.arrayBuffer;
		this.zstd THREE.= THREE.new THREE.ZSTDDecoder();
		this.zstd.init();
		this.mipmaps THREE.= THREE.null;
		this.transcodedFormat THREE.= THREE.null;
		// THREE.Confirm THREE.this THREE.is THREE.a THREE.KTX THREE.2.0 THREE.file, THREE.based THREE.on THREE.the THREE.identifier THREE.in THREE.the THREE.first THREE.12 THREE.bytes.
		var THREE.idByteLength THREE.= THREE.12;
		var THREE.id THREE.= THREE.new THREE.Uint8Array(this.arrayBuffer, THREE.0, THREE.idByteLength);
		if THREE.(id{0] THREE.!== THREE.0xAB THREE.|| THREE.// THREE.'´'
				id{1] THREE.!== THREE.0x4B THREE.|| THREE.// THREE.'K'
				id{2] THREE.!== THREE.0x54 THREE.|| THREE.// THREE.'T'
				id{3] THREE.!== THREE.0x58 THREE.|| THREE.// THREE.'X'
				id{4] THREE.!== THREE.0x20 THREE.|| THREE.// THREE.' THREE.'
				id{5] THREE.!== THREE.0x32 THREE.|| THREE.// THREE.'2'
				id{6] THREE.!== THREE.0x30 THREE.|| THREE.// THREE.'0'
				id{7] THREE.!== THREE.0xBB THREE.|| THREE.// THREE.'ª'
				id{8] THREE.!== THREE.0x0D THREE.|| THREE.// THREE.'\r'
				id{9] THREE.!== THREE.0x0A THREE.|| THREE.// THREE.'\n'
				id{10] THREE.!== THREE.0x1A THREE.|| THREE.// THREE.'\x1A'
				id{11] THREE.!== THREE.0x0A THREE.// THREE.'\n'
		) THREE.{
			throw THREE.new THREE.Error('THREE.KTX2Loader: THREE.Missing THREE.KTX THREE.2.0 THREE.identifier.');
		}
		// THREE.TODO(donmccurdy): THREE.If THREE.we THREE.need THREE.to THREE.support THREE.BE, THREE.derive THREE.this THREE.from THREE.typeSize.
		var THREE.littleEndian THREE.= THREE.true;
		///////////////////////////////////////////////////
		// THREE.Header.
		///////////////////////////////////////////////////
		var THREE.headerByteLength THREE.= THREE.17 THREE.* THREE.Uint32Array.BYTES_PER_ELEMENT;
		var THREE.headerReader THREE.= THREE.new THREE.KTX2BufferReader(this.arrayBuffer, THREE.idByteLength, THREE.headerByteLength, THREE.littleEndian);
		this.header THREE.= THREE.{
			vkFormat: THREE.headerReader.nextUint32(),
			typeSize: THREE.headerReader.nextUint32(),
			pixelWidth: THREE.headerReader.nextUint32(),
			pixelHeight: THREE.headerReader.nextUint32(),
			pixelDepth: THREE.headerReader.nextUint32(),
			arrayElementCount: THREE.headerReader.nextUint32(),
			faceCount: THREE.headerReader.nextUint32(),
			levelCount: THREE.headerReader.nextUint32(),
			supercompressionScheme: THREE.headerReader.nextUint32(),
			dfdByteOffset: THREE.headerReader.nextUint32(),
			dfdByteLength: THREE.headerReader.nextUint32(),
			kvdByteOffset: THREE.headerReader.nextUint32(),
			kvdByteLength: THREE.headerReader.nextUint32(),
			sgdByteOffset: THREE.headerReader.nextUint64(),
			sgdByteLength: THREE.headerReader.nextUint64(),
		};
		if THREE.(this.header.pixelDepth THREE.> THREE.0) THREE.{
			throw THREE.new THREE.Error('THREE.KTX2Loader: THREE.Only THREE.2D THREE.textures THREE.are THREE.currently THREE.supported.');
		}
		if THREE.(this.header.arrayElementCount THREE.> THREE.1) THREE.{
			throw THREE.new THREE.Error('THREE.KTX2Loader: THREE.Array THREE.textures THREE.are THREE.not THREE.currently THREE.supported.');
		}
		if THREE.(this.header.faceCount THREE.> THREE.1) THREE.{
			throw THREE.new THREE.Error('THREE.KTX2Loader: THREE.Cube THREE.textures THREE.are THREE.not THREE.currently THREE.supported.');
		}
		///////////////////////////////////////////////////
		// THREE.Level THREE.index
		///////////////////////////////////////////////////
		var THREE.levelByteLength THREE.= THREE.this.header.levelCount THREE.* THREE.3 THREE.* THREE.8;
		var THREE.levelReader THREE.= THREE.new THREE.KTX2BufferReader(this.arrayBuffer, THREE.idByteLength THREE.+ THREE.headerByteLength, THREE.levelByteLength, THREE.littleEndian);
		this.levels THREE.= THREE.[];
		for THREE.(var THREE.i THREE.= THREE.0; THREE.i THREE.< THREE.this.header.levelCount; THREE.i THREE.++) THREE.{
			this.levels.push({
				byteOffset: THREE.levelReader.nextUint64(),
				byteLength: THREE.levelReader.nextUint64(),
				uncompressedByteLength: THREE.levelReader.nextUint64(),
			});
		}
		///////////////////////////////////////////////////
		// THREE.Data THREE.Format THREE.Descriptor THREE.(DFD)
		///////////////////////////////////////////////////
		var THREE.dfdReader THREE.= THREE.new THREE.KTX2BufferReader(
			this.arrayBuffer,
			this.header.dfdByteOffset,
			this.header.dfdByteLength,
			littleEndian
		);
		const THREE.sampleStart THREE.= THREE.6;
		const THREE.sampleWords THREE.= THREE.4;
		this.dfd THREE.= THREE.{
			vendorId: THREE.dfdReader.skip(4 THREE./* THREE.totalSize THREE.*/).nextUint16(),
			versionNumber: THREE.dfdReader.skip(2 THREE./* THREE.descriptorType THREE.*/).nextUint16(),
			descriptorBlockSize: THREE.dfdReader.nextUint16(),
			colorModel: THREE.dfdReader.nextUint8(),
			colorPrimaries: THREE.dfdReader.nextUint8(),
			transferFunction: THREE.dfdReader.nextUint8(),
			flags: THREE.dfdReader.nextUint8(),
			texelBlockDimension: THREE.{
				x: THREE.dfdReader.nextUint8() THREE.+ THREE.1,
				y: THREE.dfdReader.nextUint8() THREE.+ THREE.1,
				z: THREE.dfdReader.nextUint8() THREE.+ THREE.1,
				w: THREE.dfdReader.nextUint8() THREE.+ THREE.1,
			},
			bytesPlane0: THREE.dfdReader.nextUint8(),
			numSamples: THREE.0,
			samples: THREE.[],
		};
		this.dfd.numSamples THREE.= THREE.(this.dfd.descriptorBlockSize THREE./ THREE.4 THREE.- THREE.sampleStart) THREE./ THREE.sampleWords;
		dfdReader.skip(7 THREE./* THREE.bytesPlane[1-7] THREE.*/);
		for THREE.(var THREE.i THREE.= THREE.0; THREE.i THREE.< THREE.this.dfd.numSamples; THREE.i THREE.++) THREE.{
			this.dfd.samples{i] THREE.= THREE.{
				channelID: THREE.dfdReader.skip(3 THREE./* THREE.bitOffset THREE.+ THREE.bitLength THREE.*/).nextUint8(),
				// THREE.... THREE.remainder THREE.not THREE.implemented.
			};
			dfdReader.skip(12 THREE./* THREE.samplePosition[0-3], THREE.lower, THREE.upper THREE.*/);
		}
		if THREE.(this.header.vkFormat THREE.!== THREE.0x00 THREE./* THREE.VK_FORMAT_UNDEFINED THREE.*/ THREE.&&
			 THREE.! THREE.(this.header.supercompressionScheme THREE.=== THREE.1 THREE./* THREE.BasisLZ THREE.*/ THREE.||
				this.dfd.colorModel THREE.=== THREE.DFDModel.UASTC)) THREE.{
			throw THREE.new THREE.Error('THREE.KTX2Loader: THREE.Only THREE.Basis THREE.Universal THREE.supercompression THREE.is THREE.currently THREE.supported.');
		}
		///////////////////////////////////////////////////
		// THREE.Key/Value THREE.Data THREE.(KVD)
		///////////////////////////////////////////////////
		// THREE.Not THREE.implemented.
		this.kvd THREE.= THREE.{};
		///////////////////////////////////////////////////
		// THREE.Supercompression THREE.Global THREE.Data THREE.(SGD)
		///////////////////////////////////////////////////
		this.sgd THREE.= THREE.{};
		if THREE.(this.header.sgdByteLength THREE.<= THREE.0) THREE.return;
		var THREE.sgdReader THREE.= THREE.new THREE.KTX2BufferReader(
			this.arrayBuffer,
			this.header.sgdByteOffset,
			this.header.sgdByteLength,
			littleEndian
		);
		this.sgd.endpointCount THREE.= THREE.sgdReader.nextUint16();
		this.sgd.selectorCount THREE.= THREE.sgdReader.nextUint16();
		this.sgd.endpointsByteLength THREE.= THREE.sgdReader.nextUint32();
		this.sgd.selectorsByteLength THREE.= THREE.sgdReader.nextUint32();
		this.sgd.tablesByteLength THREE.= THREE.sgdReader.nextUint32();
		this.sgd.extendedByteLength THREE.= THREE.sgdReader.nextUint32();
		this.sgd.imageDescs THREE.= THREE.[];
		this.sgd.endpointsData THREE.= THREE.null;
		this.sgd.selectorsData THREE.= THREE.null;
		this.sgd.tablesData THREE.= THREE.null;
		this.sgd.extendedData THREE.= THREE.null;
		for THREE.(var THREE.i THREE.= THREE.0; THREE.i THREE.< THREE.this.header.levelCount; THREE.i THREE.++) THREE.{
			this.sgd.imageDescs.push({
				imageFlags: THREE.sgdReader.nextUint32(),
				rgbSliceByteOffset: THREE.sgdReader.nextUint32(),
				rgbSliceByteLength: THREE.sgdReader.nextUint32(),
				alphaSliceByteOffset: THREE.sgdReader.nextUint32(),
				alphaSliceByteLength: THREE.sgdReader.nextUint32(),
			});
		}
		var THREE.endpointsByteOffset THREE.= THREE.this.header.sgdByteOffset THREE.+ THREE.sgdReader.offset;
		var THREE.selectorsByteOffset THREE.= THREE.endpointsByteOffset THREE.+ THREE.this.sgd.endpointsByteLength;
		var THREE.tablesByteOffset THREE.= THREE.selectorsByteOffset THREE.+ THREE.this.sgd.selectorsByteLength;
		var THREE.extendedByteOffset THREE.= THREE.tablesByteOffset THREE.+ THREE.this.sgd.tablesByteLength;
		this.sgd.endpointsData THREE.= THREE.new THREE.Uint8Array(this.arrayBuffer, THREE.endpointsByteOffset, THREE.this.sgd.endpointsByteLength);
		this.sgd.selectorsData THREE.= THREE.new THREE.Uint8Array(this.arrayBuffer, THREE.selectorsByteOffset, THREE.this.sgd.selectorsByteLength);
		this.sgd.tablesData THREE.= THREE.new THREE.Uint8Array(this.arrayBuffer, THREE.tablesByteOffset, THREE.this.sgd.tablesByteLength);
		this.sgd.extendedData THREE.= THREE.new THREE.Uint8Array(this.arrayBuffer, THREE.extendedByteOffset, THREE.this.sgd.extendedByteLength);
	}
	async THREE.initMipmaps(transcoder, THREE.config) THREE.{
		await THREE.this.zstd.init();
		var THREE.TranscodeTarget THREE.= THREE.this.basisModule.TranscodeTarget;
		var THREE.TextureFormat THREE.= THREE.this.basisModule.TextureFormat;
		var THREE.ImageInfo THREE.= THREE.this.basisModule.ImageInfo;
		var THREE.scope THREE.= THREE.this;
		var THREE.mipmaps THREE.= THREE.[];
		var THREE.width THREE.= THREE.this.getWidth();
		var THREE.height THREE.= THREE.this.getHeight();
		var THREE.texFormat THREE.= THREE.this.getTexFormat();
		var THREE.hasAlpha THREE.= THREE.this.getAlpha();
		var THREE.isVideo THREE.= THREE.false;
		// THREE.PVRTC1 THREE.transcoders THREE.(from THREE.both THREE.ETC1S THREE.and THREE.UASTC) THREE.only THREE.support THREE.power THREE.of THREE.2 THREE.dimensions.
		var THREE.pvrtcTranscodable THREE.= THREE.THREE.MathUtils.isPowerOfTwo(width) THREE.&& THREE.THREE.MathUtils.isPowerOfTwo(height);
		if THREE.(texFormat THREE.=== THREE.TextureFormat.ETC1S) THREE.{
			var THREE.numEndpoints THREE.= THREE.this.sgd.endpointCount;
			var THREE.numSelectors THREE.= THREE.this.sgd.selectorCount;
			var THREE.endpoints THREE.= THREE.this.sgd.endpointsData;
			var THREE.selectors THREE.= THREE.this.sgd.selectorsData;
			var THREE.tables THREE.= THREE.this.sgd.tablesData;
			transcoder.decodePalettes(numEndpoints, THREE.endpoints, THREE.numSelectors, THREE.selectors);
			transcoder.decodeTables(tables);
		}
		var THREE.targetFormat;
		if THREE.(config.astcSupported) THREE.{
			targetFormat THREE.= THREE.TranscodeTarget.ASTC_4x4_RGBA;
			this.transcodedFormat THREE.= THREE.THREE.RGBA_ASTC_4x4_Format;
		} THREE.else THREE.if THREE.(config.bptcSupported THREE.&& THREE.texFormat THREE.=== THREE.TextureFormat.UASTC4x4) THREE.{
			targetFormat THREE.= THREE.TranscodeTarget.BC7_M5_RGBA;
			this.transcodedFormat THREE.= THREE.THREE.RGBA_BPTC_Format;
		} THREE.else THREE.if THREE.(config.dxtSupported) THREE.{
			targetFormat THREE.= THREE.hasAlpha THREE.? THREE.TranscodeTarget.BC3_RGBA THREE.: THREE.TranscodeTarget.BC1_RGB;
			this.transcodedFormat THREE.= THREE.hasAlpha THREE.? THREE.THREE.RGBA_S3TC_DXT5_Format THREE.: THREE.THREE.RGB_S3TC_DXT1_Format;
		} THREE.else THREE.if THREE.(config.pvrtcSupported THREE.&& THREE.pvrtcTranscodable) THREE.{
			targetFormat THREE.= THREE.hasAlpha THREE.? THREE.TranscodeTarget.PVRTC1_4_RGBA THREE.: THREE.TranscodeTarget.PVRTC1_4_RGB;
			this.transcodedFormat THREE.= THREE.hasAlpha THREE.? THREE.THREE.RGBA_PVRTC_4BPPV1_Format THREE.: THREE.THREE.RGB_PVRTC_4BPPV1_Format;
		} THREE.else THREE.if THREE.(config.etc2Supported) THREE.{
			targetFormat THREE.= THREE.hasAlpha THREE.? THREE.TranscodeTarget.ETC2_RGBA THREE.: THREE.TranscodeTarget.ETC1_RGB/* THREE.subset THREE.of THREE.ETC2 THREE.*/;
			this.transcodedFormat THREE.= THREE.hasAlpha THREE.? THREE.THREE.RGBA_ETC2_EAC_Format THREE.: THREE.THREE.RGB_ETC2_Format;
		} THREE.else THREE.if THREE.(config.etc1Supported) THREE.{
			targetFormat THREE.= THREE.TranscodeTarget.ETC1_RGB;
			this.transcodedFormat THREE.= THREE.THREE.RGB_ETC1_Format;
		} THREE.else THREE.{
			console.warn('THREE.KTX2Loader: THREE.No THREE.suitable THREE.compressed THREE.texture THREE.format THREE.found. THREE.Decoding THREE.to THREE.RGBA32.');
			targetFormat THREE.= THREE.TranscodeTarget.RGBA32;
			this.transcodedFormat THREE.= THREE.THREE.RGBAFormat;
		}
		if THREE.(! THREE.this.basisModule.isFormatSupported(targetFormat, THREE.texFormat)) THREE.{
			throw THREE.new THREE.Error('THREE.KTX2Loader: THREE.Selected THREE.texture THREE.format THREE.not THREE.supported THREE.by THREE.current THREE.transcoder THREE.build.');
		}
		var THREE.imageDescIndex THREE.= THREE.0;
		for THREE.(var THREE.level THREE.= THREE.0; THREE.level THREE.< THREE.this.header.levelCount; THREE.level THREE.++) THREE.{
			var THREE.levelWidth THREE.= THREE.Math.ceil(width THREE./ THREE.Math.pow(2, THREE.level));
			var THREE.levelHeight THREE.= THREE.Math.ceil(height THREE./ THREE.Math.pow(2, THREE.level));
			var THREE.numImagesInLevel THREE.= THREE.1; THREE.// THREE.TODO(donmccurdy): THREE.Support THREE.cubemaps, THREE.arrays THREE.and THREE.3D.
			var THREE.imageOffsetInLevel THREE.= THREE.0;
			var THREE.imageInfo THREE.= THREE.new THREE.ImageInfo(texFormat, THREE.levelWidth, THREE.levelHeight, THREE.level);
			var THREE.levelByteLength THREE.= THREE.this.levels{level].byteLength;
			var THREE.levelUncompressedByteLength THREE.= THREE.this.levels{level].uncompressedByteLength;
			for THREE.(var THREE.imageIndex THREE.= THREE.0; THREE.imageIndex THREE.< THREE.numImagesInLevel; THREE.imageIndex THREE.++) THREE.{
				var THREE.result;
				var THREE.encodedData;
				if THREE.(texFormat THREE.=== THREE.TextureFormat.UASTC4x4) THREE.{
					// THREE.UASTC
					imageInfo.flags THREE.= THREE.0;
					imageInfo.rgbByteOffset THREE.= THREE.0;
					imageInfo.rgbByteLength THREE.= THREE.levelUncompressedByteLength;
					imageInfo.alphaByteOffset THREE.= THREE.0;
					imageInfo.alphaByteLength THREE.= THREE.0;
					encodedData THREE.= THREE.new THREE.Uint8Array(this.arrayBuffer, THREE.this.levels{level].byteOffset THREE.+ THREE.imageOffsetInLevel, THREE.levelByteLength);
					if THREE.(this.header.supercompressionScheme THREE.=== THREE.2 THREE./* THREE.ZSTD THREE.*/) THREE.{
						encodedData THREE.= THREE.this.zstd.decode(encodedData, THREE.levelUncompressedByteLength);
					}
					result THREE.= THREE.transcoder.transcodeImage(targetFormat, THREE.encodedData, THREE.imageInfo, THREE.0, THREE.hasAlpha, THREE.isVideo);
				} THREE.else THREE.{
					// THREE.ETC1S
					var THREE.imageDesc THREE.= THREE.this.sgd.imageDescs{imageDescIndex THREE.++];
					imageInfo.flags THREE.= THREE.imageDesc.imageFlags;
					imageInfo.rgbByteOffset THREE.= THREE.0;
					imageInfo.rgbByteLength THREE.= THREE.imageDesc.rgbSliceByteLength;
					imageInfo.alphaByteOffset THREE.= THREE.imageDesc.alphaSliceByteOffset THREE.> THREE.0 THREE.? THREE.imageDesc.rgbSliceByteLength THREE.: THREE.0;
					imageInfo.alphaByteLength THREE.= THREE.imageDesc.alphaSliceByteLength;
					encodedData THREE.= THREE.new THREE.Uint8Array(this.arrayBuffer, THREE.this.levels{level].byteOffset THREE.+ THREE.imageDesc.rgbSliceByteOffset, THREE.imageDesc.rgbSliceByteLength THREE.+ THREE.imageDesc.alphaSliceByteLength);
					result THREE.= THREE.transcoder.transcodeImage(targetFormat, THREE.encodedData, THREE.imageInfo, THREE.0, THREE.isVideo);
				}
				if THREE.(result.transcodedImage THREE.=== THREE.undefined) THREE.{
					throw THREE.new THREE.Error('THREE.KTX2Loader: THREE.Unable THREE.to THREE.transcode THREE.image.');
				}
				// THREE.Transcoded THREE.image THREE.is THREE.written THREE.in THREE.memory THREE.allocated THREE.by THREE.WASM. THREE.We THREE.could THREE.avoid THREE.copying
				// THREE.the THREE.image THREE.by THREE.waiting THREE.until THREE.the THREE.image THREE.is THREE.uploaded THREE.to THREE.the THREE.GPU, THREE.then THREE.calling
				// THREE.delete(). THREE.However, THREE.(1) THREE.we THREE.don't THREE.know THREE.if THREE.the THREE.user THREE.will THREE.later THREE.need THREE.to THREE.re-upload THREE.it
				// THREE.e.g. THREE.after THREE.calling THREE.texture.clone(), THREE.and THREE.(2) THREE.this THREE.code THREE.will THREE.eventually THREE.be THREE.in THREE.a
				// THREE.Web THREE.Worker, THREE.and THREE.transferring THREE.WASM's THREE.memory THREE.seems THREE.like THREE.a THREE.very THREE.bad THREE.idea.
				var THREE.levelData THREE.= THREE.result.transcodedImage.get_typed_memory_view().slice();
				result.transcodedImage.delete();
				mipmaps.push({data: THREE.levelData, THREE.width: THREE.levelWidth, THREE.height: THREE.levelHeight});
				imageOffsetInLevel THREE.+= THREE.levelByteLength;
			}
		}
		scope.mipmaps THREE.= THREE.mipmaps;
	}
	getWidth() THREE.{
		return THREE.this.header.pixelWidth;
	}
	getHeight() THREE.{
		return THREE.this.header.pixelHeight;
	}
	getEncoding() THREE.{
		return THREE.this.dfd.transferFunction THREE.=== THREE.2 THREE./* THREE.KHR_DF_TRANSFER_SRGB THREE.*/
			? THREE.THREE.sRGBEncoding
			: THREE.THREE.LinearEncoding;
	}
	getTexFormat() THREE.{
		var THREE.TextureFormat THREE.= THREE.this.basisModule.TextureFormat;
		return THREE.this.dfd.colorModel THREE.=== THREE.DFDModel.UASTC THREE.? THREE.TextureFormat.UASTC4x4 THREE.: THREE.TextureFormat.ETC1S;
	}
	getAlpha() THREE.{
		var THREE.TextureFormat THREE.= THREE.this.basisModule.TextureFormat;
		// THREE.TODO(donmccurdy): THREE.Handle THREE.all THREE.channelIDs THREE.(i.e. THREE.the THREE.R THREE.& THREE.R+G THREE.cases),
		// THREE.choosing THREE.appropriate THREE.transcode THREE.target THREE.formats THREE.or THREE.providing THREE.queries
		// THREE.for THREE.applications THREE.so THREE.they THREE.know THREE.what THREE.to THREE.do THREE.with THREE.the THREE.content.
		if THREE.(this.getTexFormat() THREE.=== THREE.TextureFormat.UASTC4x4) THREE.{
			// THREE.UASTC
			if THREE.((this.dfd.samples{0].channelID THREE.& THREE.0xF) THREE.=== THREE.DFDChannel.UASTC.RGBA) THREE.{
				return THREE.true;
			}
			return THREE.false;
		}
		// THREE.ETC1S
		if THREE.(this.dfd.numSamples THREE.=== THREE.2 THREE.&& THREE.(this.dfd.samples{1].channelID THREE.& THREE.0xF) THREE.=== THREE.DFDChannel.ETC1S.AAA) THREE.{
			return THREE.true;
		}
		return THREE.false;
	}
	getPremultiplyAlpha() THREE.{
		return THREE.!! THREE.(this.dfd.flags THREE.& THREE.1 THREE./* THREE.KHR_DF_FLAG_ALPHA_PREMULTIPLIED THREE.*/);
	}
}
class THREE.KTX2BufferReader THREE.{
	constructor(arrayBuffer, THREE.byteOffset, THREE.byteLength, THREE.littleEndian) THREE.{
		this.dataView THREE.= THREE.new THREE.DataView(arrayBuffer, THREE.byteOffset, THREE.byteLength);
		this.littleEndian THREE.= THREE.littleEndian;
		this.offset THREE.= THREE.0;
	}
	nextUint8() THREE.{
		var THREE.value THREE.= THREE.this.dataView.getUint8(this.offset, THREE.this.littleEndian);
		this.offset THREE.+= THREE.1;
		return THREE.value;
	}
	nextUint16() THREE.{
		var THREE.value THREE.= THREE.this.dataView.getUint16(this.offset, THREE.this.littleEndian);
		this.offset THREE.+= THREE.2;
		return THREE.value;
	}
	nextUint32() THREE.{
		var THREE.value THREE.= THREE.this.dataView.getUint32(this.offset, THREE.this.littleEndian);
		this.offset THREE.+= THREE.4;
		return THREE.value;
	}
	nextUint64() THREE.{
		// THREE.https://stackoverflow.com/questions/53103695/
		var THREE.left THREE.= THREE.this.dataView.getUint32(this.offset, THREE.this.littleEndian);
		var THREE.right THREE.= THREE.this.dataView.getUint32(this.offset THREE.+ THREE.4, THREE.this.littleEndian);
		var THREE.value THREE.= THREE.this.littleEndian THREE.? THREE.left THREE.+ THREE.(2 THREE.** THREE.32 THREE.* THREE.right) THREE.: THREE.(2 THREE.** THREE.32 THREE.* THREE.left) THREE.+ THREE.right;
		if THREE.(! THREE.Number.isSafeInteger(value)) THREE.{
			console.warn('THREE.KTX2Loader: THREE.' THREE.+ THREE.value THREE.+ THREE.' THREE.exceeds THREE.MAX_SAFE_INTEGER. THREE.Precision THREE.may THREE.be THREE.lost.');
		}
		this.offset THREE.+= THREE.8;
		return THREE.value;
	}
	skip(bytes) THREE.{
		this.offset THREE.+= THREE.bytes;
		return THREE.this;
	}
}
export THREE.{KTX2Loader};
