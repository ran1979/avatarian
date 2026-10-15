// Copied to the clipboard from the toolbar. Attach to a Node2D in a Godot 4 project.
export const GODOT_IMPORT_SCRIPT = `# Avatarian blueprint loader for Godot 4.
# Keep the exported JSON and the assets/ folder inside the project (res://).
@tool
extends Node2D

@export var blueprint_path: String = "res://avatarian_blueprint.json"

func _ready() -> void:
	load_blueprint(blueprint_path)

func load_blueprint(path: String) -> void:
	for child in get_children():
		child.queue_free()
	var data = JSON.parse_string(FileAccess.get_file_as_string(path))
	if typeof(data) != TYPE_DICTIONARY:
		push_error("Avatarian: could not parse " + path)
		return
	for layer in data.get("layers", []):
		var texture := ResourceLoader.load(layer["godotResPath"]) as Texture2D
		if texture == null:
			push_warning("Avatarian: missing " + layer["godotResPath"])
			continue
		var sprite := Sprite2D.new()
		sprite.name = layer["id"]
		sprite.texture = texture
		sprite.position = Vector2(layer["x"], layer["y"])
		sprite.scale = Vector2(layer["scaleX"], layer["scaleY"])
		sprite.rotation = deg_to_rad(layer["rotation"])
		sprite.z_index = int(layer["zIndex"])
		if layer.has("fillColor"):
			sprite.modulate = Color.html(layer["fillColor"])
		add_child(sprite)
`;
