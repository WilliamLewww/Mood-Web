var treeString = "";
var position = 0;

function getVerticesFromID(ID) {
	var data = document.getElementById(ID).innerHTML.split(' ');
	var vertices = [];
	var vertex = [parseFloat(data[0])];

	for (var x = 1; x < data.length; x++) {
		vertex.push(parseFloat(data[x]));

		if (x % 2 == 1) {
			vertices.push(vertex);
			vertex = [];
		}
	}

	return vertices;
}

function getColorFromID(ID) {
	var data = document.getElementById(ID).innerHTML.split(' ');
	var colors = [];

	data.forEach(color => {
		colors.push(parseFloat(color));
	});

	return colors;
}

function printBinaryTree(tree) {
	treeString = "";
	printBinaryTreeToken(tree, treeString);
	treeString = "R: " + tree.splitter + "\n" + treeString;
	console.log(treeString);
}

function printBinaryTreeToken(root, prefix) {
	if (root == null) { return; }

	var hasLeft = (root.left != null);
	var hasRight = (root.right != null);

	if (!hasLeft && !hasRight) { return; }

	treeString += prefix;
	treeString += ((hasLeft  && hasRight) ? "----" : "");
	treeString += ((!hasLeft && hasRight) ? "----" : "");

	if (hasRight) {
		var printStrand = (hasLeft && hasRight && (root.right.right != null || root.right.left != null));
		var newPrefix = prefix + (printStrand ? "|   " : "    ");
		treeString += "F: " + root.right.splitter + "\n";
		printBinaryTreeToken(root.right, newPrefix);
	}

	if (hasLeft) {
		treeString += (hasRight ? prefix : "") + "----" + "B: " + root.left.splitter + "\n";
		printBinaryTreeToken(root.left, prefix + "    ");
	}
}

function getBinaryTreeFromID(ID) {
	var data = document.getElementById(ID).innerHTML.split(' ');
	var root = readBinaryTreeToken(root, data, position);

	return root;
}

var currentID = 0;
function readBinaryTreeToken(node, data) {
	var token = data[position].replace('(', '').replace(')', '');
	position += 1;
	if (token == '#') { return null; }
	else {
		var pointAS = token.split('|')[0];
		pointAS = pointAS.split(',');
		var pointA = [parseFloat(pointAS[0]), parseFloat(pointAS[1])];
		token = token.split('|')[1];

		var pointBS = token.split(':')[0];
		pointBS = pointBS.split(',');
		var pointB = [parseFloat(pointBS[0]), parseFloat(pointBS[1])]; 
		token = token.split(':')[1];

		token = token.split(',');

		var wall = new Wall(pointA, pointB, [parseFloat(token[0]), parseFloat(token[1]), parseFloat(token[2]), 255]);
		node = new WallNode(currentID, wall);
		currentID += 1;

		node.left = readBinaryTreeToken(node.left, data, position);
		node.right = readBinaryTreeToken(node.right, data, position);
	}

	return node;
}