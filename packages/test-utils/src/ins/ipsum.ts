const makeWordPairs = (acc: string[], cur: string, index: number) => {
	const newAcc = [...acc];
	if (index % 2) {
		newAcc[newAcc.length - 1] = `${newAcc[newAcc.length - 1]} ${cur}`;
	} else {
		newAcc.push(cur);
	}
	return newAcc;
};

const makeMap = (list: string[], label: 'ci' | 'cs'): Map<string, string[]> => {
	const mockMap = new Map();

	for (let i = 0; i < list.length; ) {
		const quarterLength = list.length / 4;
		const firstHalf = i < quarterLength * 2;
		const lastQuarter = i >= quarterLength * 3;
		if (firstHalf) {
			mockMap.set(`${label}-${i}`, [list[i], list[i + 1], list[i + 2]]);
			i = i + 3;
		} else if (lastQuarter) {
			mockMap.set(`${label}-${i}`, [list[i]]);
			i++;
		} else {
			mockMap.set(`${label}-${i}`, [list[i], list[i + 1]]);
			i = i + 2;
		}
	}
	return mockMap as Map<string, string[]>;
};

export const ipsumParagraphs = [
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus cursus enim eu scelerisque. Nam eleifend purus sed quam facilisis aliquet. Fusce feugiat neque elit, non egestas ipsum molestie quis. Suspendisse quis ipsum malesuada, scelerisque tellus quis, auctor tortor. Nam gravida dolor at molestie facilisis. Donec faucibus nisl vitae ante accumsan, id vulputate lorem convallis. Integer condimentum nunc turpis, eget pellentesque nunc gravida nec. Maecenas in tincidunt eros. Nullam ac feugiat turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam at posuere urna. Phasellus fermentum dolor nec sapien congue feugiat. Duis aliquam, ex finibus porttitor viverra, quam augue gravida dui, quis cursus purus justo a mi.',
	'Curabitur mattis, odio id ultrices condimentum, purus diam cursus quam, et pulvinar mauris lectus vel enim. Aenean aliquet volutpat risus. Fusce ut pulvinar justo. Phasellus in lacus faucibus, facilisis dui at, mollis enim. Pellentesque ipsum sem, volutpat sit amet imperdiet et, rutrum sed purus. Aenean bibendum mauris eros, eget sagittis turpis tempus a. Suspendisse molestie ex accumsan mi semper, sed vestibulum sem fringilla. Aenean accumsan convallis rhoncus. Ut non nulla ut nisl ultrices feugiat. Mauris dignissim in neque eu mollis. Nam laoreet ullamcorper ullamcorper. Etiam porta leo vehicula euismod maximus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin at consequat urna. Aenean accumsan sollicitudin nunc, quis venenatis enim luctus ut.',
	'In ut feugiat augue. Etiam vel risus libero. Duis facilisis magna ut risus hendrerit, eget varius sem pulvinar. Curabitur molestie cursus blandit. Sed cursus felis accumsan elit eleifend, sit amet finibus risus hendrerit. Nam sed diam vel lacus interdum ornare id quis ligula. Proin facilisis ligula in nisl vehicula sagittis. Nunc ornare lorem ut bibendum egestas. Fusce sed pharetra lectus, at finibus lacus.',
	'Proin laoreet quam tempor elementum viverra. Mauris porta id felis sed blandit. Aenean iaculis nunc ut nunc commodo, vitae ornare erat varius. Vestibulum ornare scelerisque sapien quis vehicula. In nulla metus, hendrerit sed malesuada sed, euismod sit amet metus. Curabitur eu fermentum ex. Pellentesque tincidunt consectetur massa a tincidunt. Donec sit amet lacus eget magna elementum imperdiet nec ac ante. Maecenas rutrum ultrices porta. Praesent interdum dui fermentum pretium posuere. Vivamus egestas mi sed nibh tincidunt, ut aliquam nisi cursus.',
	'INTEGER AC BIBENDUM LEO. NAM EGET EST RISUS. SED PHARETRA SOLLICITUDIN ORCI, AUCTOR SUSCIPIT NEQUE EFFICITUR UT. CRAS A METUS ULTRICES, DIGNISSIM NIBH AC, INTERDUM MAURIS. QUISQUE CONVALLIS PELLENTESQUE NUNC ET ORNARE. PELLENTESQUE PORTTITOR SCELERISQUE TELLUS, A TEMPUS NISI HENDRERIT NON. CURABITUR LIGULA LIGULA, TEMPUS AT ARCU AT, POSUERE PELLENTESQUE ELIT. NULLA IMPERDIET LEO AT EFFICITUR PLACERAT. CURABITUR A MAURIS VARIUS IPSUM ACCUMSAN SCELERISQUE. SED MAXIMUS TINCIDUNT ANTE, A TEMPUS QUAM. NAM VEHICULA VEL QUAM MATTIS CONGUE. AENEAN INTERDUM TELLUS VEL DUI CONVALLIS ULTRICES.',
	'MAECENAS ID FELIS EFFICITUR, VEHICULA TURPIS A, FERMENTUM DIAM. PRAESENT QUIS TURPIS SIT AMET ERAT PORTA PORTA. PRAESENT DICTUM NIBH SIT AMET ERAT ULLAMCORPER, ET CONVALLIS ODIO CONSEQUAT. IN HAC HABITASSE PLATEA DICTUMST. IN MATTIS MALESUADA JUSTO, NEC VEHICULA LECTUS COMMODO QUIS. CRAS UT VARIUS LIBERO. DONEC TEMPUS QUAM IN LEO VESTIBULUM VULPUTATE. IN AUGUE TELLUS, PLACERAT EUISMOD SCELERISQUE EGET, BIBENDUM UT LOREM.',
	'Maecenas facilisis purus eget tristique ultricies. Aenean id lectus ex. Phasellus varius purus id lacinia tempus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam mauris massa, bibendum non porttitor dignissim, eleifend at ante. Etiam est elit, pharetra ac orci non, vestibulum venenatis quam. Aliquam eros nulla, efficitur non metus non, ultricies sollicitudin felis. Suspendisse a eros id diam placerat feugiat sed et felis. Phasellus tempor erat eget dapibus pharetra. Nulla scelerisque massa vel mi placerat, a sodales libero mollis. Curabitur porttitor condimentum blandit.',
	'Nunc a interdum magna. Suspendisse commodo ullamcorper nibh nec pellentesque. Aenean consequat diam justo, ut dictum magna mattis ut. Mauris sit amet dignissim nulla. Nam commodo molestie orci, ultrices convallis ante placerat nec. Mauris ut arcu vitae lacus elementum venenatis. Nunc sit amet libero in ante tristique mollis. Maecenas iaculis velit id ipsum suscipit porttitor. Ut non fringilla elit. Suspendisse eget odio magna. Vestibulum faucibus mattis dignissim. Vivamus sodales lacus eget nunc tempor, nec rhoncus nunc pulvinar. Fusce vestibulum magna tincidunt risus tincidunt pharetra.',
	'Donec mattis, risus ut volutpat rutrum, neque urna sollicitudin justo, ut hendrerit ligula nisi non metus. Curabitur convallis dolor ac odio imperdiet mattis. Vivamus justo ligula, pretium ullamcorper nibh vitae, mattis consequat tortor. Fusce suscipit rutrum varius. Morbi ut urna blandit, sagittis arcu ut, sagittis justo. Mauris aliquet quam sit amet risus ultricies hendrerit. Maecenas erat nibh, maximus sed eleifend auctor, tincidunt vitae velit. Sed dignissim accumsan diam, eget posuere elit efficitur quis. Proin convallis, eros vitae tristique rutrum, nisi ligula blandit leo, vitae luctus risus dui id nibh. Maecenas sed orci et nulla elementum ultricies id nec justo. Donec aliquam vitae ex in rutrum.',
	'Donec in pretium est, in ultrices libero. Curabitur suscipit nisl tempus dolor pulvinar, a interdum erat consectetur. Nam non mattis neque, ac pellentesque justo. Curabitur vitae tortor ornare, hendrerit risus non, vestibulum nisi. Praesent vehicula metus eget enim cursus, ultricies porttitor nisl consequat. Ut lacinia risus quis velit viverra varius. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris at mauris velit. Suspendisse vel pretium nunc. In eu ornare felis. Vestibulum ante nisl, auctor at dolor et, condimentum volutpat lacus. Aenean at commodo justo. Nulla ullamcorper vitae sem eget laoreet.',
	'Donec consectetur orci vitae mattis pharetra. Cras tristique ex purus, non tristique enim tristique sed. Vivamus facilisis molestie mattis. Pellentesque nec dui vel ligula convallis pharetra tincidunt sagittis mi. Cras ut rutrum enim, sed venenatis mi. Maecenas placerat, enim et sollicitudin aliquet, neque lacus ultricies mi, euismod tincidunt dolor lectus vitae risus. Vivamus non faucibus ex, sit amet pellentesque tellus. Integer pulvinar dolor eu tortor pellentesque ultricies. Donec vitae congue dui. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris laoreet eros at metus dapibus auctor. Duis dapibus vel nibh a mollis. Integer non leo in tortor pulvinar lobortis.',
	'Mauris placerat tellus quis venenatis vehicula. Donec tincidunt nisl augue. Maecenas tincidunt pulvinar augue. Vivamus sit amet lectus sodales purus venenatis mollis. Suspendisse tristique luctus augue, at ultricies enim ornare sollicitudin. Nunc eget vestibulum nisl. Praesent sodales tellus vel arcu tincidunt commodo. Mauris vehicula dapibus diam et porttitor. Cras laoreet, augue at bibendum dictum, risus elit auctor turpis, sed facilisis nibh orci dictum orci. In commodo orci id felis vestibulum mollis. Maecenas condimentum iaculis metus varius semper.',
	'Ut sed nisi sem. Duis eget neque varius, molestie metus eget, venenatis mi. Nam elementum a lorem non pulvinar. Sed maximus tortor id libero dignissim, in fermentum nibh blandit. Suspendisse pharetra nisl at bibendum fringilla. Quisque vel dolor pellentesque, suscipit augue in, varius nunc. Vivamus ornare dapibus justo. Aliquam et tellus lobortis, pharetra nisl sed, ullamcorper felis. Mauris interdum egestas lacus id posuere. Curabitur sit amet gravida metus. Cras aliquam pharetra mi at mollis.',
	'Aenean vitae rutrum ante. Sed quis est a enim aliquam eleifend quis in nulla. Integer fringilla, augue eget faucibus euismod, velit nulla ornare quam, a hendrerit est libero et sem. Curabitur pretium eu massa sed malesuada. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pharetra sem nec purus ultrices, vitae fermentum sapien scelerisque. Mauris faucibus nulla urna, at malesuada lacus consectetur id. Ut ac vehicula eros, eget suscipit eros. Etiam ut est nec lacus maximus lacinia ac placerat tellus. Sed elit nisi, suscipit ut neque nec, blandit faucibus nisi.',
	'Nunc iaculis massa volutpat lacus sodales, vitae sollicitudin sapien dignissim. Nulla tincidunt mi eu lectus consectetur, nec ultrices mi dictum. Sed scelerisque dignissim est mattis condimentum. Praesent id velit lorem. Cras maximus mollis semper. Sed sagittis quis urna et scelerisque. Donec consectetur tincidunt sem. Nam eu leo vel neque consectetur consectetur nec et urna. Cras libero sem, fermentum ut venenatis non, condimentum sed ligula. Nunc sit amet mi nisl. Nulla elit tortor, vestibulum eu malesuada eu, interdum non odio. Curabitur id imperdiet sapien, ac hendrerit magna.',
	'Morbi ut molestie arcu. Quisque ultrices metus lorem, ut sodales augue lacinia ut. Donec mollis iaculis orci in sollicitudin. Aenean feugiat, elit nec rhoncus laoreet, magna diam commodo elit, auctor egestas est purus eu metus. Donec efficitur rhoncus nunc, et finibus dui maximus in. Morbi eget mi vitae massa mollis viverra. Nullam sit amet aliquet dui. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Aliquam erat volutpat. Ut malesuada sem ut aliquam egestas. Suspendisse a mattis diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent nec lacinia metus, nec molestie nunc.',
	'Nulla quis nibh varius dolor suscipit mattis. In eleifend est sed condimentum laoreet. Nunc diam dolor, mollis sed enim nec, accumsan pellentesque elit. Phasellus viverra ante non augue suscipit pulvinar. Praesent ornare velit ut dolor tincidunt, at dictum est ultricies. Nulla interdum orci sed bibendum luctus. Proin imperdiet placerat velit eu bibendum. Sed semper enim ut purus laoreet aliquet. Quisque sed ultricies elit. Vestibulum ornare sem vitae vehicula pretium. Suspendisse luctus tortor eget convallis fringilla. Praesent volutpat lorem lectus, vel iaculis ante accumsan hendrerit. Pellentesque sit amet odio a dui ultrices ornare ut eu tortor. Phasellus magna felis, tristique ac pellentesque sit amet, tempus ut erat. Vivamus eu lectus turpis. Aenean est ex, egestas lobortis placerat cursus, sollicitudin nec dui.',
	'Fusce convallis vestibulum augue at ultrices. Donec metus est, dapibus eget erat eget, pharetra posuere nisi. Etiam volutpat fringilla nunc, quis varius ipsum tempus eu. Nam rhoncus, lacus sed pellentesque sollicitudin, augue magna facilisis nibh, a rutrum sem ligula id quam. Suspendisse quis posuere erat, et bibendum arcu. Suspendisse dapibus nibh augue, eget luctus erat porttitor quis. Pellentesque est arcu, molestie feugiat maximus tempus, aliquet vitae purus. Morbi sed lobortis erat. Donec bibendum egestas auctor. Proin bibendum, nisl a hendrerit lacinia, turpis mi lacinia mi, eu venenatis tortor nibh eget nisi. In dictum, turpis vel scelerisque tristique, turpis tellus gravida nunc, nec fermentum felis est at mi. Mauris mi quam, auctor quis pellentesque vitae, bibendum sodales felis.',
	'Nulla at pulvinar massa. Donec finibus quis leo non viverra. Cras laoreet sit amet libero eget interdum. Sed ac finibus lorem. Maecenas lacinia dictum massa, pellentesque malesuada arcu pellentesque sed. Sed at dapibus ante. Sed vestibulum volutpat felis sed convallis. Morbi tincidunt sodales viverra.',
	'Sed non blandit purus. Pellentesque molestie, dolor sed ullamcorper aliquet, nisl lorem malesuada purus, ac consequat sapien diam ac leo. Aliquam erat volutpat. Aliquam finibus dui dui, et gravida orci iaculis sed. Mauris vestibulum nisl orci, at blandit augue convallis in. Duis velit nisl, commodo eget mattis a, pretium sed felis. Nulla nunc nisi, placerat eget consequat vel, elementum a est. Donec eget arcu vel libero tempus pharetra vitae maximus turpis. Suspendisse tristique vitae est ac blandit. Nunc ultrices sem dolor, in bibendum neque tincidunt nec. Mauris iaculis arcu nec auctor commodo.'
];

const ipsumInsensitiveWords = `${ipsumParagraphs[0]} ${ipsumParagraphs[1]}`
	.replaceAll(/[,.;]/g, '')
	.split(' ');

const ipsumInsensitiveWordPairs = `${ipsumParagraphs[2]} ${ipsumParagraphs[3]}`
	.replaceAll(/[,.;]/g, '')
	.split(' ')
	.reduce(makeWordPairs, []);

export const ipsumCaseInsensitive = makeMap(
	[...ipsumInsensitiveWords, ...ipsumInsensitiveWordPairs],
	'ci'
);

const ipsumSensitiveWords = `${ipsumParagraphs[4]}`.replaceAll(/[,.;]/g, '').split(' ');

const ipsumSensitiveWordPairs = `${ipsumParagraphs[5]}}}`
	.replaceAll(/[,.;]/g, '')
	.split(' ')
	.reduce(makeWordPairs, []);

export const ipsumCaseSensitive = makeMap(
	[...ipsumSensitiveWords, ...ipsumSensitiveWordPairs],
	'cs'
);

export const ipsumText = ipsumParagraphs.join('\n\n');
