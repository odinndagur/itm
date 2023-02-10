-- @block
select sign.phrase || '_id_' || sign.id as s, related.phrase || '_id_' || related.id as r from sign
join sign_related on sign.id = sign_related.sign_id
join sign as related on related.id = sign_related.related_id
group by sign.id limit 10;

-- @block
SELECT
sign.id,
sign.phrase,
sign.youtube_id,
sign.youtube_link,
group_concat(related.phrase || '_id_' || related.id),
group_concat(DISTINCT collection.name || '_id_' || collection.id)
FROM
sign
JOIN sign_related ON sign.id = sign_related.sign_id
JOIN sign as related ON sign_related.related_id = related.id
JOIN sign_collection ON sign_collection.sign_id = sign.id
JOIN collection ON sign_collection.collection_id = collection.id
GROUP BY sign.id;



-- @block
select name || '_id_' || id from collection;


-- @block
drop table sign_fts
-- @block
 CREATE VIRTUAL TABLE sign_fts USING FTS5(
    id,
    phrase,
    youtube_id,
    youtube_link,
    related_signs,
    collections
)

-- @block

INSERT INTO sign_fts(
    rowid,
    id,
    phrase,
    youtube_id,
    youtube_link,
    related_signs,
    collections
) SELECT
sign.id,
sign.id,
sign.phrase,
sign.youtube_id,
sign.youtube_link,
group_concat(related.phrase || '_id_' || related.id),
group_concat(DISTINCT collection.name || '_id_' || collection.id)
FROM
sign
JOIN sign_related ON sign.id = sign_related.sign_id
JOIN sign as related ON sign_related.related_id = related.id
JOIN sign_collection ON sign_collection.sign_id = sign.id
JOIN collection ON sign_collection.collection_id = collection.id
GROUP BY sign.id;



-- @block
select * from sign_fts where related_signs match "aa*"