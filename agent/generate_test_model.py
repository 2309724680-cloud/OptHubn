"""生成一个简单的 ONNX 模型用于测试 Agent。"""

import os
import numpy as np
import onnx
from onnx import helper, TensorProto

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "test_model.onnx")


def make_test_model() -> None:
    # 一个简单模型: y = X * W + b  (Linear)
    # 输入: (1, 10)  输出: (1, 5)

    X = helper.make_tensor_value_info("input", TensorProto.FLOAT, [1, 10])
    Y = helper.make_tensor_value_info("output", TensorProto.FLOAT, [1, 5])

    W_init = np.random.randn(10, 5).astype(np.float32)
    b_init = np.random.randn(5).astype(np.float32)

    W = helper.make_node(
        "Constant",
        inputs=[],
        outputs=["W"],
        value=helper.make_tensor(
            name="W_tensor",
            data_type=TensorProto.FLOAT,
            dims=[10, 5],
            vals=W_init.flatten().tolist(),
        ),
    )
    B = helper.make_node(
        "Constant",
        inputs=[],
        outputs=["B"],
        value=helper.make_tensor(
            name="B_tensor",
            data_type=TensorProto.FLOAT,
            dims=[5],
            vals=b_init.flatten().tolist(),
        ),
    )
    MatMul = helper.make_node("MatMul", inputs=["input", "W"], outputs=["matmul_out"])
    Add = helper.make_node("Add", inputs=["matmul_out", "B"], outputs=["output"])

    graph = helper.make_graph(
        nodes=[W, B, MatMul, Add],
        name="TestLinear",
        inputs=[X],
        outputs=[Y],
    )

    model = helper.make_model(
        graph,
        opset_imports=[helper.make_opsetid("", 14)],
        ir_version=7,
    )
    model = onnx.shape_inference.infer_shapes(model)
    onnx.checker.check_model(model)

    onnx.save(model, OUTPUT_PATH)
    print(f"已生成: {OUTPUT_PATH}")

    # 验证推理
    import onnxruntime as ort
    sess = ort.InferenceSession(OUTPUT_PATH, providers=["CPUExecutionProvider"])
    x = np.random.randn(1, 10).astype(np.float32)
    out = sess.run(None, {"input": x})
    print(f"验证推理成功，输入 shape={x.shape}，输出 shape={out[0].shape}")


if __name__ == "__main__":
    make_test_model()
